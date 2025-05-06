import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app: Application = express();

// Middleware para habilitar CORS e JSON
app.use(cors());
app.use(express.json());

// Montar as rotas de autenticação
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
