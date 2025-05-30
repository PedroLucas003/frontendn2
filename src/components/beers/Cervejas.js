import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cervejas.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cervejas = ({ cart, addToCart, updateCart }) => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const fetchBeers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/beers`);
      setBeers(response.data);
    } catch (error) {
      console.error('Erro ao buscar cervejas:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (id) => {
    updateCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    updateCart(
      cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.preco * item.quantity);
    }, 0).toFixed(2);
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    fetchBeers();

    const setupAnimation = () => {
      const cards = document.querySelectorAll('.cerveja-card');
      if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { 
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => observer.observe(card));
        return () => cards.forEach(card => observer.unobserve(card));
      }
    };

    const animationTimer = setTimeout(setupAnimation, 100);
    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <section id="cervejas-section" className="cervejas-section">
      <h2 className="section-title">Nossas <span className="destaque">Cervejas</span></h2>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : (
        <div className="cervejas-grid">
          {beers.map((beer) => (
            <div key={beer._id} className="cerveja-card">
              <div className="cerveja-imagem-container">
                <img
                  src="https://via.placeholder.com/400x500.png?text=Garrafa+Virada"
                  alt={`Virada ${beer.beerType}`}
                  className="cerveja-imagem"
                  loading="lazy"
                />
                <div className="cerveja-detalhes">
                  <div className="cerveja-tag">Virada</div>
                  <div className="cerveja-ano">{beer.yearCreated}</div>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart({
                    id: beer._id,
                    nome: `Virada ${beer.beerType}`,
                    tipo: beer.description,
                    beerType: beer.beerType,
                    imagem: 'https://via.placeholder.com/100x150.png?text=Cerveja+Virada',
                    preco: beer.price,
                    quantity: 1
                  })}
                  disabled={beer.quantity <= 0}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {beer.quantity > 0 ? 'Adicionar' : 'Esgotado'}
                </button>
              </div>
              <div className="cerveja-info">
                <h3>Virada {beer.beerType}</h3>
                <p className="cerveja-tipo">{beer.description}</p>
                <div className="cerveja-stock">
                  <span className="stock-label">Estoque:</span>
                  <span className={`stock-value ${beer.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {beer.quantity} unidades
                  </span>
                </div>
                <div className="cerveja-price">
                  R$ {beer.price.toFixed(2)}
                </div>
                <span className="cerveja-teor">{beer.alcoholContent}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`cart-icon ${getTotalItems() > 0 ? 'has-items' : ''}`} onClick={() => setShowCart(!showCart)}>
        <i className="fas fa-shopping-cart"></i>
        {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
      </div>

      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Seu Carrinho</h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.imagem} alt={item.nome} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.nome}</h4>
                    <p className="cart-item-type">{item.tipo}</p>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <i className="fas fa-minus"></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    R$ {(item.preco * item.quantity).toFixed(2)}
                    <button 
                      className="remove-item" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total:</span>
                <span>R$ {getTotalPrice()}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
      
      {showCart && <div className="cart-overlay" onClick={() => setShowCart(false)}></div>}
    </section>
  );
};

export default Cervejas;