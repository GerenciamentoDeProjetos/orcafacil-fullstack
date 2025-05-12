import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}?charset=utf8`,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('Conexão com o banco de dados bem-sucedida.'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));
