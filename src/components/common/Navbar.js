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
          <Link to="/" className="home-link">
            <span className="button-icon">⌂</span>
            <span className="button-text">Home</span>
          </Link>
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
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                      </Link>
                      <Link to="/users" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-users"></i> Gerenciar Usuários
                      </Link>
                    </>
                  )}
                  <Link to="/checkout" onClick={() => setMenuOpen(false)} className="cart-menu-item">
                    <i className="fas fa-shopping-cart"></i> Carrinho
                    {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
                  </Link>
                  <button onClick={handleLogoutClick} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">
              <span className="button-icon">→</span>
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
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
            <i className="fas fa-home"></i> Home
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.isAdmin && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                  </Link>
                  <Link to="/users" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
                    <i className="fas fa-users"></i> Gerenciar Usuários
                  </Link>
                </>
              )}
              <Link to="/checkout" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
                <i className="fas fa-shopping-cart"></i> Carrinho
                {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
              </Link>
              <button onClick={handleLogoutClick} className="mobile-menu-item logout-btn">
                <i className="fas fa-sign-out-alt"></i> Sair
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
              <i className="fas fa-sign-in-alt"></i> Login
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