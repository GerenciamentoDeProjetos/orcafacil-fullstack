import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/imgs/orcafacil-logo.png';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica no frontend
    if (!formData.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Enviando dados para registro:', formData); // Log para depuração

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Resposta do servidor:', response); // Log para depuração
      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao registrar:', data); // Log para depuração
        alert(data.error ?? 'Erro ao registrar');
        setIsLoading(false);
        return;
      }

      console.log('Registro bem-sucedido:', data); // Log para depuração
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error); // Log para depuração
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
        {!submitted ? (
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
                Criar conta OrçaFácil
              </h1>
              <p className="text-primary-150">Registre-se no nosso sistema</p>
              <p className="text-sm italic text-primary-4 font-medium">
                Organize sua vida financeira com facilidade
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Endereço de e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme a senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>
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
                  <span>Registrar agora</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-center text-black text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-4 hover:text-primary-5 font-medium no-underline">
                Fazer login!
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4 bg-white p-6 rounded-2xl shadow-lg">
            <CheckCircle className="text-green-500 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-green-600">Conta criada com sucesso!</h2>
            <p className="text-gray-600">Agora você pode fazer login no OrçaFácil.</p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-primary-6 hover:bg-primary-1 text-white rounded-lg transition-all"
            >
              Ir para login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default RegisterPage;
