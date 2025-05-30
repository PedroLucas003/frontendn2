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

      // Mock de opções de frete (substitua por sua lógica real se necessário)
      const shippingOption = {
        Codigo: '04510',
        Valor: '15,00',
        PrazoEntrega: '3',
        nome: 'Sedex'
      };

      const response = await axios.post(
        `${API_URL}/api/payments/create-preference`,
        {
          items: cartItems,
          deliveryData,
          shippingOption
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redireciona para o checkout do Mercado Pago
      window.location.href = response.data.sandbox_init_point || response.data.init_point;

    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Erro ao finalizar compra');
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, deliveryData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação especial para CEP
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

  return (
    <div className="checkout-container">
      <h1>Finalize sua Compra</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Seu Carrinho</h2>
          {/* Renderização dos itens do carrinho... */}
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
                />
              </div>
              
              {/* Outros campos do formulário... */}
            </form>
          </div>
          
          <div className="order-total-section">
            <button 
              onClick={handleCheckout}
              disabled={isLoading || !deliveryData.cep}
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