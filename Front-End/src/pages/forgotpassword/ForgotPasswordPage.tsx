import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/imgs/orcafacil-logo.png';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-2 via-primary-1 to-primary-1 animated-gradient">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <img
              src={logo}
              alt="Logo OrçaFácil"
              className="w-[140px] h-[140px] mx-auto"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent">
              Recuperar Senha
            </h1>
            <p className="text-primary-150">Informe seu email para recuperar o acesso</p>
            <p className="text-sm italic text-primary-4 font-medium">
              Um link de redefinição será enviado para você
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">Seu Email</label>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Digite seu Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
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
                  <span>Enviando...</span>
                ) : (
                  <>
                    <span>Enviar link</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <p className="text-center text-black text-sm">
                Lembrou a senha?{' '}
                <Link to="/login" className="text-primary-4 hover:text-primary-5 font-medium no-underline">
                  Voltar para login
                </Link>
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-center text-primary-6">
                Email enviado com sucesso!
              </h2>
              <p className="text-center text-gray-600">
                Verifique sua caixa de entrada para redefinir sua senha.
              </p>
              <Link to="/login" className="text-primary-4 hover:text-primary-5 font-medium text-sm">
                Voltar para login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
