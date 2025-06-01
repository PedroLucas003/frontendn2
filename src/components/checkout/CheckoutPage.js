import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CheckoutPage = ({ cartItems }) => {
  const [deliveryData, setDeliveryData] = useState({
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/payments/create-preference`,
        {
          items: cartItems,
          deliveryData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      window.location.href = response.data.sandbox_init_point || response.data.init_point;

    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Erro ao finalizar compra');
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, deliveryData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cep') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = numericValue.length > 5 
        ? `${numericValue.substring(0, 5)}-${numericValue.substring(5, 8)}` 
        : numericValue;
      setDeliveryData(prev => ({...prev, [name]: formattedValue}));
    } else {
      setDeliveryData(prev => ({...prev, [name]: value}));
    }
  };

  const renderCartItems = () => (
    <div className="cart-items">
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.imagem} alt={item.nome} className="cart-item-image" />
          <div className="cart-item-details">
            <h4>{item.nome}</h4>
            <p className="cart-item-type">{item.tipo}</p>
            <p>Quantidade: {item.quantity}</p>
            <p>R$ {(15.90 * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      ))}
      <div className="cart-shipping">
        <p>Frete: R$ 15,00</p>
      </div>
      <div className="cart-total">
        <p>Total: R$ {(cartItems.reduce((sum, item) => sum + (15.90 * item.quantity), 0) + 15).toFixed(2)}</p>
      </div>
    </div>
  );

  return (
    <div className="checkout-container">
      <h1>Finalize sua Compra</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Seu Carrinho</h2>
          {cartItems.length > 0 ? renderCartItems() : <p>Seu carrinho está vazio</p>}
        </div>

        <div className="delivery-payment">
          <div className="delivery-form">
            <h2>Informações de Entrega</h2>
            
            <form>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={deliveryData.cep}
                  onChange={handleInputChange}
                  maxLength="9"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Endereço</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Rua, Avenida, etc."
                  value={deliveryData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="number">Número</label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    placeholder="Nº"
                    value={deliveryData.number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="complement">Complemento</label>
                  <input
                    type="text"
                    id="complement"
                    name="complement"
                    placeholder="Apto, Bloco, etc."
                    value={deliveryData.complement}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="neighborhood">Bairro</label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  value={deliveryData.neighborhood}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Cidade</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={deliveryData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Estado</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={deliveryData.state}
                    onChange={handleInputChange}
                    maxLength="2"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
          
          <div className="order-total-section">
            <button 
              onClick={handleCheckout}
              disabled={isLoading || !deliveryData.cep || !deliveryData.address || !deliveryData.number}
              className="checkout-btn"
            >
              {isLoading ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;