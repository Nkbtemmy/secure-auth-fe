import React from 'react';
import AppRouter from './routes/AppRouter';
import './App.css'; // You'll need to create this CSS file for styling

const App: React.FC = () => {
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
};

export default App;