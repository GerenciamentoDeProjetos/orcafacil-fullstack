import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Preencha todos os campos' });
    return;
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [name, email, password_hash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err: any) {
    console.error('Erro ao registrar:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email já está em uso' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }
};
