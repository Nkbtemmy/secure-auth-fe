import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { isAuthenticated } from '../utils/auth';

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      <div
        className="auth-container bg-white text-white p-8 shadow-2xl"
        style={{ width: '500px', height: '600px', borderRadius: '10%' }}
      >
        {state?.message && (
          <div className="success-message">{state.message}</div>
        )}
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;