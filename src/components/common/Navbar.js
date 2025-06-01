import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout, user, cartItems }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    onLogout();
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleMobileMenu}>
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <Link to="/" className="home-link">Home</Link>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-toggle" onClick={toggleMenu}>
                <span className="user-email">{user?.email}</span>
                <i className={`fas ${menuOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
              
              {menuOpen && (
                <div className="dropdown-menu">
                  {user?.isAdmin && (
                    <>
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <Link to="/users" onClick={() => setMenuOpen(false)}>
                        Gerenciar Usuários
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogoutClick} className="logout-btn">
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">
              <span className="button-text">Login</span>
            </Link>
          )}
          
          {cartItems > 0 && (
            <Link to="/checkout" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{cartItems}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Menu lateral para mobile */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          
          {isAuthenticated && (
            <>
              {user?.isAdmin && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/users" onClick={() => setMobileMenuOpen(false)}>
                    Gerenciar Usuários
                  </Link>
                </>
              )}
              <button onClick={handleLogoutClick} className="logout-btn">
                Sair
              </button>
            </>
          )}
          
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>
      
      {/* Overlay para fechar o menu ao clicar fora */}
      {mobileMenuOpen && (
        <div className="menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Navbar;