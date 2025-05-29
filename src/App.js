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
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderSuccessPage from './components/checkout/OrderSuccessPage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_URL}/api/auth/validate`, {
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
    setCart([]); // Limpa o carrinho ao fazer logout
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
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
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          user={user} 
          cartItems={cart.length}
        />
        
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
                <Cervejas cart={cart} updateCart={updateCart} />
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
            
            <Route path="/checkout" element={
              <CheckoutPage cartItems={cart} updateCart={updateCart} />
            } />
            
            <Route path="/order-success" element={
              isAuthenticated ? (
                <OrderSuccessPage clearCart={clearCart} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            <Route path="*" element={
              <Navigate to="/" replace />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;