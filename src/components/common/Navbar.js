import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Cervejaria Virada</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">Sair</button>
          </>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;