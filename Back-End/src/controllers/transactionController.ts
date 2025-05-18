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

// Obter as 7 transações mais recentes do usuário
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
