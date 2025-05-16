import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const location = useLocation();
  
  
  const isAuthPage = location.pathname === '/login';

  return (
    <div className={`app ${isAuthPage ? 'auth-page' : ''}`}>
      
    </div>
  );
}

export default App;