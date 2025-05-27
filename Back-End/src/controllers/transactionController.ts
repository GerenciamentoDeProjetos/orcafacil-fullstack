import { Request, Response } from 'express';
import { pool } from '../config/database';

// Função auxiliar para forçar conversão para UTF-8
const ensureUTF8 = (value: string): string => {
  return Buffer.from(value, 'utf-8').toString();
};

// Função auxiliar para determinar is_income corretamente
const parseIsIncome = (input: any): boolean => {
  if (input === 0 || input === '0') return true;
  if (input === 1 || input === '1') return false;
  return null as any;
};

// Categorias fixas
const categories = {
  income: ['Salário', 'Renda Extra', 'Investimentos', 'Prêmios e Presentes', 'Reembolsos', 'Outros'],
  expense: ['Moradia', 'Alimentação', 'Transporte', 'Saúde e Bem-estar', 'Lazer e Compras', 'Outros'],
};

// Criar uma nova transação
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      title,
      category,
      amount,
      transaction_day,
      transaction_month,
      transaction_year,
      is_income,
      type
    } = req.body;

    const utfTitle = ensureUTF8(title);
    const utfCategory = ensureUTF8(category);

    if (transaction_year < 1000 || transaction_year > new Date().getFullYear()) {
      res.status(400).json({
        error: 'O ano da transação é inválido. Deve ser entre 1000 e o ano atual.',
      });
      return;
    }

    const isIncomeValue = parseIsIncome(is_income !== undefined ? is_income : type);
    if (isIncomeValue === null) {
      res.status(400).json({ error: 'is_income (ou type) inválido. Deve ser true/false ou 0/1.' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO transactions
        (user_id, title, category, amount, transaction_day, transaction_month, transaction_year, is_income)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, utfTitle, utfCategory, amount, transaction_day, transaction_month, transaction_year, isIncomeValue]
    );

    res.status(201).json({
      message: 'Transação criada com sucesso.',
      transaction: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao criar transação:', err);
    res.status(500).json({ error: 'Erro ao criar transação.' });
  }
};

// Obter saldo, receitas e despesas até um mês/ano
export const getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!userId || !month || !year) {
      res.status(400).json({ error: 'Parâmetros userId, month e year são obrigatórios.' });
      return;
    }

    const result = await pool.query(
      `
      SELECT
        SUM(CASE WHEN is_income = true THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN is_income = false THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE user_id = $1
        AND (transaction_year < $3 OR (transaction_year = $3 AND transaction_month <= $2))
      `,
      [userId, month, year]
    );

    const { total_income, total_expense } = result.rows[0];
    const balance = parseFloat(total_income ?? 0) - parseFloat(total_expense ?? 0);

    res.status(200).json({
      total_income: parseFloat(total_income ?? 0),
      total_expense: parseFloat(total_expense ?? 0),
      balance,
    });
  } catch (err) {
    console.error('Erro ao obter saldo:', err);
    res.status(500).json({ error: 'Erro ao obter saldo.' });
  }
};

// Obter as 20 transações mais recentes do usuário
export const getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Parâmetro userId é obrigatório.' });
      return;
    }

    const result = await pool.query(
      `
      SELECT id, title, category, amount, transaction_day, transaction_month, transaction_year, created_at, is_income
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [userId]
    );

    res.status(200).json({ transactions: result.rows });
  } catch (err) {
    console.error('Erro ao obter transações recentes:', err);
    res.status(500).json({ error: 'Erro ao obter transações recentes.' });
  }
};

// Obter despesas mensais por ano do usuário (para o gráfico)
export const getMonthlyExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { year } = req.query;

    if (!userId || !year) {
      res.status(400).json({ error: 'Parâmetros userId e year são obrigatórios.' });
      return;
    }

    // Busca as despesas (is_income = false) agrupadas por mês para o ano selecionado
    const result = await pool.query(
      `
      SELECT transaction_month, SUM(amount) AS total_expense
      FROM transactions
      WHERE user_id = $1
        AND transaction_year = $2
        AND is_income = false
      GROUP BY transaction_month
      ORDER BY transaction_month
      `,
      [userId, year]
    );

    // Monta um array de 12 meses preenchendo zero para meses sem despesa
    const expensesPerMonth = Array(12).fill(0);
    result.rows.forEach((row: any) => {
      const idx = Number(row.transaction_month) - 1;
      if (idx >= 0 && idx < 12) {
        expensesPerMonth[idx] = Number(row.total_expense);
      }
    });

    res.status(200).json({ expensesPerMonth });
  } catch (err) {
    console.error('Erro ao obter despesas mensais:', err);
    res.status(500).json({ error: 'Erro ao obter despesas mensais.' });
  }
};

// Obter despesas/receitas agrupadas por categoria do usuário para o mês/ano selecionado
export const getCategoryByMonthAndYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { year, month, type } = req.query;

    if (!userId || !year || !month || !type) {
      res.status(400).json({ error: 'Parâmetros userId, year, month e type são obrigatórios.' });
      return;
    }

    if (!['income', 'expense'].includes(type as string)) {
      res.status(400).json({ error: 'Parâmetro type deve ser income ou expense.' });
      return;
    }

    const isIncome = type === 'income';
    const categoryList = categories[type as 'income' | 'expense'];

    // Busca dados reais do banco para as categorias desse mês/ano
    const result = await pool.query(
      `
      SELECT
        category,
        SUM(amount) AS total,
        COUNT(*) AS count
      FROM transactions
      WHERE user_id = $1
        AND is_income = $2
        AND transaction_year = $3
        AND transaction_month = $4
      GROUP BY category
      `,
      [userId, isIncome, year, month]
    );

    // Gera um objeto para lookup rápido dos dados reais
    const dataMap: Record<string, { total: number; count: number }> = {};
    let totalAll = 0;
    result.rows.forEach((row: any) => {
      dataMap[row.category] = {
        total: Number(row.total),
        count: Number(row.count),
      };
      totalAll += Number(row.total);
    });

    // Para cada categoria fixa, compõe o resultado, preenchendo zero se não houver lançamento
    const categoryData = categoryList.map((cat) => ({
      category: cat,
      total: dataMap[cat]?.total ?? 0,
      count: dataMap[cat]?.count ?? 0,
      percent: totalAll > 0 ? Math.round(((dataMap[cat]?.total ?? 0) / totalAll) * 100) : 0,
    }));

    res.status(200).json({ categoryData });
  } catch (err) {
    console.error('Erro ao obter dados por categoria e mês/ano:', err);
    res.status(500).json({ error: 'Erro ao obter dados por categoria e mês/ano.' });
  }
};

// Nova rota: Obter despesas agrupadas por categoria do usuário (para o gráfico de categoria)
export const getExpensesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { year } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'Parâmetro userId é obrigatório.' });
      return;
    }

    // Se year for informado, filtra pelo ano, senão pega todas despesas do usuário
    let result;
    if (year) {
      result = await pool.query(
        `
        SELECT
          category,
          SUM(amount) AS total_expense,
          COUNT(*) AS transaction_count
        FROM transactions
        WHERE user_id = $1
          AND is_income = false
          AND transaction_year = $2
        GROUP BY category
        ORDER BY total_expense DESC
        `,
        [userId, year]
      );
    } else {
      result = await pool.query(
        `
        SELECT
          category,
          SUM(amount) AS total_expense,
          COUNT(*) AS transaction_count
        FROM transactions
        WHERE user_id = $1
          AND is_income = false
        GROUP BY category
        ORDER BY total_expense DESC
        `,
        [userId]
      );
    }

    const rows = result.rows;
    const totalAll = rows.reduce((sum, row) => sum + Number(row.total_expense), 0);

    const categoryData = rows.map((row: any) => ({
      category: row.category,
      total: Number(row.total_expense),
      count: Number(row.transaction_count),
      percent: totalAll > 0 ? Math.round((Number(row.total_expense) / totalAll) * 100) : 0,
    }));

    res.status(200).json({ categoryData });
  } catch (err) {
    console.error('Erro ao obter despesas por categoria:', err);
    res.status(500).json({ error: 'Erro ao obter despesas por categoria.' });
  }
};
