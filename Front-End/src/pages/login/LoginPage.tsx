import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/imgs/orcafacil-logo.png';

export function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // ADICIONADO AQUI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? 'Erro ao realizar login');
        setIsLoading(false);
        return;
      }

      navigate('/dashboard');

    } catch {
      alert('Erro ao conectar com o servidor. Verifique sua conexão ou tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-2 via-primary-1 to-primary-1 animated-gradient">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <img
              src={logo}
              alt="Logo OrçaFácil"
              className="w-[140px] h-[140px] mx-auto"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent">
              Login OrçaFácil
            </h1>
            <p className="text-primary-150">Entre na sua conta</p>
            <p className="text-sm italic text-primary-4 font-medium">Seu orçamento na palma da mão</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Seu Email</label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua Senha"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-6 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembre de mim
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-primary-6 hover:text-primary-1 no-underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-6 hover:bg-primary-1 text-white'
            }`}
          >
            {isLoading ? (
              <span>Carregando...</span>
            ) : (
              <>
                <span>Fazer login</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="text-center text-black text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary-4 hover:text-primary-5 font-medium no-underline">
              Registre-se agora!
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
