import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    setIsLoading(true);
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Login realizado com sucesso!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-2 via-primary-1 to-primary-1 animated-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent animate-gradient">
              Welcome Back
            </h1>
            <p className="text-primary-150 mt-2">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email Address</label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email Address"
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
                placeholder="Password"
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
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-primary-6 hover:text-primary-1 no-underline">
              Forgot password?
            </a>
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
              <span>Loading...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="text-center text-black text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-4 hover:text-primary-5 font-medium no-underline">
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;