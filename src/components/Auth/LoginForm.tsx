import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { setToken, setUserData } from '../../utils/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      
      // Save auth info
      setToken(token);
      setUserData(user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = (err as any)?.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
        className="block text-left text-gray-700 text-sm font-bold mb-2"
        htmlFor="email"
          >
        Email
          </label>
          <input
        className="w-full px-3 py-2 text-black border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
          />
        </div>

        <div className="mb-6">
          <label
        className="block text-left text-gray-700 text-sm font-bold mb-2"
        htmlFor="password"
          >
        Password
          </label>
          <input
        className="w-full px-3 py-2 text-black border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="password"
        type="password"
        placeholder="******************"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={loading}
          >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : (
          'Login'
        )}
          </button>
        </div>
      </form>
      
      <p className="text-center text-gray-600 text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-primary-500 hover:text-primary-700">
          Register here
        </a>
      </p>
    </div>
  );
};

export default LoginForm;