import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const navigate = useNavigate();

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
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
    
    if (userData.isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    navigate('/');
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
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
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        user={user} 
        cartItems={cart.reduce((total, item) => total + item.quantity, 0)}
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
              <Cervejas 
                cart={cart} 
                addToCart={addToCart} 
                updateCart={updateCart} 
              />
            </>
          } />
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard" element={
            isAuthenticated && user?.isAdmin ? (
              <BeerDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/users" element={
            isAuthenticated && user?.isAdmin ? (
              <UserDashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/checkout" element={
            <CheckoutPage cartItems={cart} updateCart={updateCart} clearCart={clearCart} />
          } />
          
          <Route path="/order-success" element={
            <OrderSuccessPage clearCart={clearCart} />
          } />
          
          <Route path="*" element={
            <Navigate to="/" replace />
          } />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;