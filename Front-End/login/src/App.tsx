import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Lock, Mail } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-150 via-primary-100 to-primary-50 animate-gradient">
      <div className="min-h-screen flex items-center justify-between px-4 lg:px-12">
        {/* Left side - Space for logo/ad */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="text-white">
            <LogIn className="h-24 w-24 mb-6" />
            <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl opacity-90">Sign in to continue your journey</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end pr-8">
          <div className="max-w-lg w-full space-y-8 bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-xl">
            <div className="text-center">
              <LogIn className="mx-auto h-14 w-14 text-primary-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account to continue
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none relative block w-full pl-12 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-250 hover:text-primary-300">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-primary-350 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 transition-all duration-300 ease-in-out disabled:opacity-70"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <a href="#" className="font-medium text-primary-250 hover:text-primary-300">
                Sign up!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;