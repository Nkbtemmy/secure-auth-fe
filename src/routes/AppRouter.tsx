import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import DashboardRouter from './DashboardRouter';
import { isAuthenticated } from '../utils/auth';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
