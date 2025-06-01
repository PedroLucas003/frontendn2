import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <Link to="/">Cervejaria Virada</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isAuthenticated ? (
          <>
            {/* Mostra Dashboard apenas para admin */}
            {user?.isAdmin && (
              <Link to="/dashboard">Dashboard</Link>
            )}
            
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">
              <span className="button-icon">←</span>
              <span className="button-text">Sair</span>
            </button>
            
            {/* Mostra Gerenciar Usuários apenas para admin */}
            {user?.isAdmin && (
              <Link to="/users">Gerenciar Usuários</Link>
            )}
          </>
        ) : (
          <Link to="/login" className="login-link">
            <span className="button-icon">→</span>
            <span className="button-text">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;