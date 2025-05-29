import React from 'react';
import './CheckoutPage.css';

const CheckoutPage = ({ cartItems }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (15.90 * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalize sua Compra</h1>
      
      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Resumo do Pedido</h2>
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Seu carrinho está vazio</p>
          ) : (
            <>
              <ul className="cart-items-list">
                {cartItems.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="item-image-container">
                      <img 
                        src={item.imagem} 
                        alt={item.nome} 
                        className="item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100x150.png?text=Cerveja+Virada";
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.nome}</h3>
                      <p className="item-type">{item.tipo}</p>
                      <div className="item-quantity-price">
                        <span>Qtd: {item.quantity}</span>
                        <span>R$ {(15.90 * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="order-total">
                <span>Total:</span>
                <span>R$ {calculateTotal()}</span>
              </div>
            </>
          )}
        </div>

        <div className="payment-form">
          <h2>Informações de Pagamento</h2>
          <div className="form-notice">
            <p>Esta é uma demonstração frontend. O processamento real de pagamentos será implementado posteriormente.</p>
          </div>
          <form className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Nome no Cartão</label>
              <input type="text" id="name" placeholder="Como no cartão" />
            </div>
            <div className="form-group">
              <label htmlFor="card">Número do Cartão</label>
              <input type="text" id="card" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Validade</label>
                <input type="text" id="expiry" placeholder="MM/AA" />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" />
              </div>
            </div>
            <button type="button" className="submit-order-btn">
              Confirmar Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;