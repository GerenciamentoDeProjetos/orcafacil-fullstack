import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    if (!formData.email.includes('@')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
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
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-300 bg-clip-text text-transparent animate-gradient">
                Create Account
              </h1>
              <p className="text-primary-150 mt-2">Join our community today</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="name" className="sr-only">Full Name</label>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  required
                />
              </div>

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

              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-6 h-5 w-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
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
                <span>Loading...</span>
              ) : (
                <>
                  <span>Register Now</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-center text-black text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-4 hover:text-primary-5 font-medium no-underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-primary-350" />
            </div>
            <h2 className="text-2xl font-bold text-primary-150">Registration Successful!</h2>
            <p className="text-primary-150">
              Welcome to our community! Check your email to verify your account.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-primary-6 text-white py-3 rounded-lg hover:bg-primary-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;