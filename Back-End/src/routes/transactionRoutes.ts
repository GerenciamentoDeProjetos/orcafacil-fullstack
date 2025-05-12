import express from 'express';
import { createTransaction, getUserTransactions } from '../controllers/transactionController';

const router = express.Router();

// Rota para criar uma nova transação
router.post('/', (req, res, next) => {
  console.log('POST /transactions chamada'); // Log para verificar a rota
  next();
}, createTransaction);

// Rota para buscar todas as transações de um usuário
router.get('/', (req, res, next) => {
  console.log('GET /transactions chamada'); // Log para verificar a rota
  next();
}, getUserTransactions);

export default router;
