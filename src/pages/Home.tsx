import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Home: React.FC = () => {
  const authenticated = isAuthenticated();

  return (
    <div className="home-page bg-gradient-to-br from-blue-600 to-indigo-600 min-h-screen flex flex-col items-center justify-center text-white p-4 rounded-es-full
     rounded-ee-full">
      <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2">Welcome to Secure Dashboard</h1>
      <p className="text-lg">A secure application with user authentication and protected routes</p>
      </header>
      
      <section className="cta-section mb-8">
      {authenticated ? (
        <div className="text-center">
        <p className="mb-4">You are logged in!</p>
        <Link 
          to="/dashboard"
          className="bg-white text-black py-2 px-4 rounded-full font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        >
          Go to Dashboard
        </Link>
        </div>
      ) : (
        <div className="text-center">
        <p className="mb-4">Get started by logging in or creating an account</p>
        <div className="button-group flex gap-4 justify-center">
          <Link 
          to="/login"
          className="bg-white text-black py-2 px-4 rounded-full font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
          Login
          </Link>
          <Link 
          to="/register"
          className="bg-transparent border border-white py-2 px-4 rounded-full font-semibold transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
          Register
          </Link>
        </div>
        </div>
      )}
      </section>
      
      <section className="features w-full max-w-4xl">
      <h2 className="text-3xl font-bold mb-4 text-center">Features</h2>
      <div className="feature-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="feature-card bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-2 text-black">Secure Authentication</h3>
        <p className="text-black">JWT-based authentication system</p>
        </div>
        <div className="feature-card bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-2 text-black">Protected Routes</h3>
        <p className="text-black">Access control for sensitive pages</p>
        </div>
        <div className="feature-card bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-2 text-black">User Dashboard</h3>
        <p className="text-black">Personalized user experience</p>
        </div>
        <div className="feature-card bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h3 className="text-2xl font-semibold mb-2 text-black">Profile Management</h3>
        <p className="text-black">Update your personal information</p>
        </div>
      </div>
      </section>
    </div>
  );
};

export default Home;