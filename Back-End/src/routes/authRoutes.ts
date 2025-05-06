import express from 'express';
import { registerUser, loginUser } from '../controllers/authController'; // Importando funções do authController
import { pool } from '../config/database';

const router = express.Router();

// Endpoint para registrar um novo usuário
router.post('/register', registerUser);

// Endpoint para login
router.post('/login', loginUser);

// Endpoint para retornar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, email, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

export default router;
