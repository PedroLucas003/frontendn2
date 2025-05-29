import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccessPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderSuccessPage = ({ clearCart }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    // Limpa o carrinho quando a página é carregada
    if (clearCart) {
      clearCart();
    }

    const fetchOrder = async () => {
      try {
        let orderData;
        
        if (paymentId) {
          // Busca detalhes do pagamento na API do Mercado Pago
          const response = await axios.get(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
              headers: {
                'Authorization': `Bearer APP_USR-1033194409526725-052912-384749a140d7670bc8e8bd57e1bff0c8-585645372`
              }
            }
          );
          
          // Busca o pedido no seu backend
          const orderResponse = await axios.get(
            `${API_URL}/api/payments/order-status/${response.body.order.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          orderData = orderResponse.data;
        } else if (preferenceId) {
          const response = await axios.get(
            `${API_URL}/api/payments/order-status/${preferenceId}`, 
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          orderData = response.data;
        } else {
          navigate('/');
          return;
        }
        
        setOrder(orderData);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentId, preferenceId, navigate, clearCart]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-success-container">
      <h1>Pedido Realizado com Sucesso!</h1>
      
      {order && (
        <div className="order-details">
          <h2>Detalhes do Pedido</h2>
          <div className="detail-row">
            <span>Status:</span>
            <span className={`status-${order.status}`}>
              {order.status === 'approved' ? 'Aprovado' : 
               order.status === 'pending' ? 'Pendente' : 
               order.status === 'failure' ? 'Falha' : 
               order.status}
            </span>
          </div>
          
          {order.mpPaymentId && (
            <div className="detail-row">
              <span>ID do Pagamento:</span>
              <span>{order.mpPaymentId}</span>
            </div>
          )}
          
          <div className="detail-row">
            <span>Total:</span>
            <span>R$ {order.total?.toFixed(2)}</span>
          </div>
          
          <div className="items-list">
            <h3>Itens</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="item">
                <span>{item.quantity}x {item.nome}</span>
                <span>R$ {(item.preco * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="delivery-info">
            <h3>Endereço de Entrega</h3>
            <p>{order.deliveryData?.address}, {order.deliveryData?.number}</p>
            <p>{order.deliveryData?.complement}</p>
            <p>{order.deliveryData?.neighborhood}</p>
            <p>{order.deliveryData?.city} - {order.deliveryData?.state}</p>
            <p>CEP: {order.deliveryData?.cep}</p>
          </div>
        </div>
      )}
      
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