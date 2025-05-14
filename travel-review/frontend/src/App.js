import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Travelogs from './pages/Travelogs';
import AuthRoute from './components/AuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AuthRoute>
                <Travelogs />
              </AuthRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;