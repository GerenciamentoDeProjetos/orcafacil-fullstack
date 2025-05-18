import express from 'express';
import { createTransaction, getBalance } from '../controllers/transactionController';

const router = express.Router();

// Rota para criar uma nova transação
router.post('/', (req, res, next) => {
  console.log('POST /transactions chamada'); // Log para verificar a rota
  next();
}, createTransaction);

// Rota para obter saldo, receitas e despesas
router.get('/balance/:userId', getBalance);

export default router;
