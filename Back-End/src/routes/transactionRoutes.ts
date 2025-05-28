import express from 'express';
import {
  createTransaction,
  getBalance,
  getRecentTransactions,
  getMonthlyExpenses,
  getExpensesByCategory,
  getCategoryByMonthAndYear,
  getMonthlyReport,
  getTransactionsByMonthAndYear,
  updateTransaction, // NOVA FUNÇÃO IMPORTADA
  deleteTransaction  // NOVA FUNÇÃO IMPORTADA
} from '../controllers/transactionController';

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

// Rota para obter despesas agrupadas por categoria do ano
router.get('/category-expenses/:userId', getExpensesByCategory);

// rota para categorias por mes e ano
router.get('/category-by-month/:userId', getCategoryByMonthAndYear);

// rota de relatório financeiro mensal/anual para o dashboard de relatórios
router.get('/monthly-report/:userId', getMonthlyReport);

// rota para obter todas as transações do usuário para mês/ano
router.get('/all/:userId', getTransactionsByMonthAndYear);

// rotas de editar e deletar transação
router.put('/:transactionId', updateTransaction);
router.delete('/:transactionId', deleteTransaction);

export default router;
