import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import BeerDashboard from './components/beers/BeerDashboard';
import Navbar from './components/common/Navbar';
import HeroBanner from './components/home/HeroBanner';
import Cervejas from './components/beers/Cervejas';
import LoginPage from './components/home/LoginPage';
import UserDashboard from './components/users/UserDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setError('Falha ao verificar autenticação. Tente novamente.');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
        
        {error && (
          <div className="global-error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <HeroBanner />
                <Cervejas />
              </>
            } />
            
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
            } />
            
            <Route path="/dashboard" element={
              isAuthenticated ? <BeerDashboard user={user} /> : <Navigate to="/login" replace />
            } />
            
            <Route path="/users" element={
              isAuthenticated ? <UserDashboard user={user} /> : <Navigate to="/login" replace />
            } />
            
            <Route path="*" element={
              <Navigate to="/" replace />
            } />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>Cervejaria Virada © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;