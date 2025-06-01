import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cervejas.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cervejas = () => {
  const [cervejas, setCervejas] = useState([]);
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const addToCart = (cerveja) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === cerveja._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === cerveja._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...cerveja, quantity: 1 }];
      }
    });
    setShowCart(true);
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/beers`);
        
        // Transforma os dados da API para o formato esperado pelo frontend
        const formattedBeers = response.data.map(beer => ({
          _id: beer._id,
          nome: `Virada ${beer.beerType}`,
          tipo: beer.beerType,
          beerType: beer.beerType,
          descricao: beer.description,
          imagem: getBeerImage(beer.beerType),
          teor: beer.alcoholContent,
          ano: beer.yearCreated,
          price: beer.price
        }));
        
        setCervejas(formattedBeers);
        
        // Cria o objeto de estoque
        const newStock = {};
        response.data.forEach(beer => {
          newStock[beer.beerType] = beer.quantity;
        });
        
        setStock(newStock);
      } catch (error) {
        console.error('Erro ao buscar cervejas:', error);
      } finally {
        setLoading(false);
      }
    };

    // Função auxiliar para obter imagem baseada no tipo de cerveja
    const getBeerImage = (beerType) => {
      const images = {
        'IPA': 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'Stout': 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'Weiss': 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'Pilsen': 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
      };
      return images[beerType] || 'https://via.placeholder.com/400x500.png?text=Garrafa+Virada';
    };

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
      <h2 className="section-title">Nossas <span className="destaque">Cervejas</span> Históricas</h2>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Carregando cervejas...</p>
        </div>
      )}

      <div className="cervejas-grid">
        {cervejas.map((cerveja) => (
          <div key={cerveja._id} className="cerveja-card">
            <div className="cerveja-imagem-container">
              <img
                src={cerveja.imagem}
                alt={cerveja.nome}
                className="cerveja-imagem"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x500.png?text=Garrafa+Virada";
                }}
              />
              <div className="cerveja-detalhes">
                <div className="cerveja-tag">Virada</div>
                <div className="cerveja-ano">{cerveja.ano}</div>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(cerveja)}
                disabled={stock[cerveja.beerType] <= 0}
              >
                <i className="fas fa-shopping-cart"></i>
                {stock[cerveja.beerType] > 0 ? 'Adicionar' : 'Esgotado'}
              </button>
            </div>
            <div className="cerveja-info">
              <h3>{cerveja.nome}</h3>
              <p className="cerveja-tipo">{cerveja.tipo}</p>
              <p className="cerveja-desc">{cerveja.descricao}</p>
              <div className="cerveja-stock">
                <span className="stock-label">Estoque:</span>
                <span className={`stock-value ${stock[cerveja.beerType] > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {stock[cerveja.beerType]} unidades
                </span>
              </div>
              <span className="cerveja-teor">{cerveja.teor}</span>
              <span className="cerveja-price">R$ {cerveja.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

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
                <div key={item._id} className="cart-item">
                  <img src={item.imagem} alt={item.nome} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.nome}</h4>
                    <p className="cart-item-type">{item.tipo}</p>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                        <i className="fas fa-minus"></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    R$ {(item.price * item.quantity).toFixed(2)}
                    <button 
                      className="remove-item" 
                      onClick={() => removeFromCart(item._id)}
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