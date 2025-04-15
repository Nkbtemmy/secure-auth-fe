import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { isAuthenticated } from '../utils/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="auth-page">
      <div
        className="auth-container bg-white text-black p-8 shadow-2xl"
        style={{ width: '500px', height: '70%', borderRadius: '10%' }}
      >
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;