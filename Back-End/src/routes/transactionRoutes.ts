import express from 'express';
import { createTransaction, getBalance, getRecentTransactions, getMonthlyExpenses } from '../controllers/transactionController';

const router = express.Router();

// Rota para criar uma nova transação
router.post('/', (req, res, next) => {
  console.log('POST /transactions chamada'); // Log para verificar a rota
  next();
}, createTransaction);

// Rota para obter saldo, receitas e despesas
router.get('/balance/:userId', getBalance);

// Rota para obter as 20 transações mais recentes
router.get('/recent/:userId', getRecentTransactions);

// Rota para obter despesas mensais do ano
router.get('/monthly-expenses/:userId', getMonthlyExpenses);

export default router;
