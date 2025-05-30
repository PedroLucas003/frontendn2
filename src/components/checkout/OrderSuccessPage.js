import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = ({ clearCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className="order-success-container">
      <h1>Pedido Realizado com Sucesso!</h1>
      <p>Obrigado por comprar na Cervejaria Virada!</p>
      <button 
        className="back-to-home"
        onClick={() => navigate('/')}
      >
        Voltar para a página inicial
      </button>
    </div>
  );
};

export default OrderSuccessPage;