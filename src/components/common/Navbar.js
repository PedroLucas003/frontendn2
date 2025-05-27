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
            <Link to="/dashboard">Dashboard</Link>
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">
              <span className="button-icon">←</span>
              <span className="button-text">Sair</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            <span className="button-icon">→</span>
            <span className="button-text">Login</span>
          </Link>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/users">Gerenciar Usuários</Link>
          </li>
        )}
      </div>
    </nav>
  );
};

export default Navbar;