import { Request, Response } from 'express';
import { pool } from '../config/database';

// Função auxiliar para forçar conversão para UTF-8
const ensureUTF8 = (value: string): string => {
  return Buffer.from(value, 'utf-8').toString();
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
      type
    } = req.body;

    // Força valores string para UTF-8
    const utfTitle = ensureUTF8(title);
    const utfCategory = ensureUTF8(category);

    const result = await pool.query(
      `INSERT INTO transactions (user_id, title, category, amount, transaction_day, transaction_month, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, utfTitle, utfCategory, amount, transaction_day, transaction_month, type]
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

// Recuperar transações de um usuário
export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'ID do usuário é obrigatório.' });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_month, transaction_day`,
      [userId]
    );

    res.json({
      message: 'Transações recuperadas com sucesso.',
      transactions: result.rows,
    });
  } catch (err) {
    console.error('Erro ao buscar transações:', err); // Log de erros
    res.status(500).json({ error: 'Erro ao buscar transações.' });
  }
};
