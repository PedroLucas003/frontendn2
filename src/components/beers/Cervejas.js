import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Cervejas.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cervejas = () => {
  const [stock, setStock] = useState({
    'IPA': 0,
    'Stout': 0,
    'Weiss': 0,
    'Pilsen': 0
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cervejas = [
    {
      id: 1,
      nome: "Virada IPA",
      tipo: "India Pale Ale",
      beerType: "IPA",
      descricao: "Amarga e aromática com notas cítricas e de pinho. Uma homenagem aos mestres cervejeiros que iniciaram nossa tradição em 1923.",
      imagem: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "3.0% ABV",
      ano: "1923"
    },
    {
      id: 2,
      nome: "Virada Stout",
      tipo: "Stout Imperial",
      beerType: "Stout",
      descricao: "Negra e cremosa com aromas de café torrado e chocolate. Receita original desde 1918, mantida em nossos arquivos secretos.",
      imagem: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "8.2% ABV",
      ano: "1918"
    },
    {
      id: 3,
      nome: "Virada Weiss",
      tipo: "Weissbier Tradicional",
      beerType: "Weiss",
      descricao: "Refrescante com notas de banana e cravo. Introduzida em 1932 por um mestre cervejeiro alemão que se juntou à nossa equipe.",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "5.0% ABV",
      ano: "1932"
    },
    {
      id: 4,
      nome: "Virada Pilsen",
      tipo: "Pilsen Premium",
      beerType: "Pilsen",
      descricao: "Clássica e refrescante com amargor equilibrado. Nossa primeira receita, criada pelos fundadores em 1905.",
      imagem: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      teor: "4.8% ABV",
      ano: "1905"
    }
  ];

  const addToCart = (cerveja) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === cerveja.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === cerveja.id 
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
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = 15.90;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    // Scroll para a seção quando o componente é montado
    if (location.hash === '#cervejas-section') {
      const element = document.getElementById('cervejas-section');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          element.classList.add('scroll-activated');
          setTimeout(() => {
            element.classList.remove('scroll-activated');
          }, 1000);
        }, 300);
      }
    }

    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/beers`);
        
        const newStock = {
          'IPA': 0,
          'Stout': 0,
          'Weiss': 0,
          'Pilsen': 0
        };
        
        response.data.forEach(beer => {
          if (newStock.hasOwnProperty(beer.beerType)) {
            newStock[beer.beerType] = beer.quantity;
          }
        });
        
        setStock(newStock);
      } catch (error) {
        console.error('Erro ao buscar estoque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();

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
  }, [location.hash]);

  return (
    <section id="cervejas-section" className="cervejas-section">
      <h2 className="section-title">Nossas <span className="destaque">Cervejas</span> Históricas</h2>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Atualizando estoque...</p>
        </div>
      )}

      <div className="cervejas-grid">
        {cervejas.map((cerveja) => (
          <div key={cerveja.id} className="cerveja-card">
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
                    R$ {(15.90 * item.quantity).toFixed(2)}
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