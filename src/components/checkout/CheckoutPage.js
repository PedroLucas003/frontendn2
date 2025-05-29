import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import './CheckoutPage.css';

// Inicializa o Mercado Pago com sua chave pública
initMercadoPago('APP_USR-0b3d3f11-7988-4acb-8fd7-d623fede2a91', { locale: 'pt-BR' }); 

const CheckoutPage = ({ cartItems, updateCart }) => {
  const [deliveryData, setDeliveryData] = useState({
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentMethod] = useState('credit_card');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const ITEM_PRICE = 15.90;

  const calculateItemsTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (ITEM_PRICE * item.quantity), 0).toFixed(2);
  }, [cartItems]);

  const calculateTotal = useCallback(() => {
    const itemsTotal = parseFloat(calculateItemsTotal());
    const shippingTotal = selectedShipping ? parseFloat(selectedShipping.Valor.replace(',', '.')) : 0;
    return (itemsTotal + shippingTotal).toFixed(2);
  }, [calculateItemsTotal, selectedShipping]);

  const calculateShipping = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mockShipping = [
        { Codigo: '04014', Valor: '15,00', PrazoEntrega: '5', nome: 'PAC' },
        { Codigo: '04510', Valor: '25,00', PrazoEntrega: '3', nome: 'Sedex' }
      ];
      
      setShippingOptions(mockShipping);
      setSelectedShipping(mockShipping[0]);
    } catch (error) {
      setError('Erro ao calcular frete. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAddressByCEP = useCallback(async (cep) => {
    try {
      if (cep.length !== 8) return;
      
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      setDeliveryData(prev => ({
        ...prev,
        cep: response.data.cep,
        address: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf
      }));
      
      await calculateShipping();
    } catch (error) {
      setError('CEP não encontrado ou serviço indisponível');
    } finally {
      setIsLoading(false);
    }
  }, [calculateShipping]);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    );
    
    updateCart(updatedCart);
  }, [cartItems, updateCart]);

  const removeItem = useCallback((id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateCart(updatedCart);
  }, [cartItems, updateCart]);

  const createMercadoPagoPreference = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedShipping || !deliveryData.cep) {
        throw new Error('Preencha todos os dados de entrega');
      }

      const response = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        {
          items: cartItems.map(item => ({
            title: item.nome,
            unit_price: parseFloat(ITEM_PRICE),
            quantity: item.quantity,
            description: item.tipo,
            picture_url: item.imagem || 'https://via.placeholder.com/100x150.png?text=Cerveja+Virada',
            currency_id: 'BRL'
          })),
          payer: {
            name: "Cliente",
            email: "cliente@example.com",
            address: {
              zip_code: deliveryData.cep.replace(/\D/g, ''),
              street_name: deliveryData.address,
              street_number: deliveryData.number,
              neighborhood: deliveryData.neighborhood,
              city: deliveryData.city,
              federal_unit: deliveryData.state
            }
          },
          shipments: {
            cost: parseFloat(selectedShipping.Valor.replace(',', '.')),
            mode: "custom"
          },
          back_urls: {
            success: `${window.location.origin}/order-success`,
            failure: `${window.location.origin}/order-failure`,
            pending: `${window.location.origin}/order-pending`
          },
          auto_return: "approved",
          notification_url: "https://your-backend-url.com/api/mercadopago/webhook",
          statement_descriptor: "VIRADA CERVEJA"
        },
        {
          headers: {
            'Authorization': `Bearer APP_USR-1033194409526725-052912-384749a140d7670bc8e8bd57e1bff0c8-585645372`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPreferenceId(response.data.id);
      setOrderData({
        items: cartItems,
        delivery: deliveryData,
        shipping: selectedShipping,
        paymentMethod,
        total: calculateTotal(),
        mpPreferenceId: response.data.id
      });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao criar pagamento. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, deliveryData, selectedShipping, paymentMethod, calculateTotal, ITEM_PRICE]);

  const handleCheckout = useCallback(async () => {
    try {
      const preference = await createMercadoPagoPreference();
      console.log('Preferência criada:', preference.id);
    } catch (error) {
      console.error('Erro no checkout:', error);
    }
  }, [createMercadoPagoPreference]);

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.length > 5 
      ? `${value.substring(0, 5)}-${value.substring(5, 8)}` 
      : value;
    setDeliveryData(prev => ({...prev, cep: formattedValue}));
  };

  useEffect(() => {
    setPreferenceId(null);
  }, [cartItems]);

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalize sua Compra</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-steps">
        <div className="step active">1. Carrinho</div>
        <div className="step">2. Pagamento</div>
        <div className="step">3. Confirmação</div>
      </div>
      
      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Seu Carrinho</h2>
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
                      <div className="item-quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                        <button 
                          className="remove-item"
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                      <div className="item-price">
                        R$ {(ITEM_PRICE * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="order-subtotal">
                <span>Subtotal:</span>
                <span>R$ {calculateItemsTotal()}</span>
              </div>
            </>
          )}
        </div>

        <div className="delivery-payment">
          <div className="delivery-form">
            <h2>Informações de Entrega</h2>
            <form>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <div className="cep-input">
                  <input 
                    type="text" 
                    id="cep" 
                    placeholder="00000-000"
                    value={deliveryData.cep}
                    onChange={handleCepChange}
                    onBlur={(e) => fetchAddressByCEP(e.target.value.replace(/\D/g, ''))}
                    maxLength="9"
                  />
                  <button 
                    type="button" 
                    className="find-cep-btn"
                    onClick={() => fetchAddressByCEP(deliveryData.cep.replace(/\D/g, ''))}
                    disabled={deliveryData.cep.replace(/\D/g, '').length !== 8}
                  >
                    Buscar
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Endereço</label>
                <input 
                  type="text" 
                  id="address" 
                  placeholder="Rua, Avenida, etc."
                  value={deliveryData.address}
                  onChange={(e) => setDeliveryData({...deliveryData, address: e.target.value})}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="number">Número</label>
                  <input 
                    type="text" 
                    id="number" 
                    placeholder="Nº"
                    value={deliveryData.number}
                    onChange={(e) => setDeliveryData({...deliveryData, number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="complement">Complemento</label>
                  <input 
                    type="text" 
                    id="complement" 
                    placeholder="Apto, Bloco, etc."
                    value={deliveryData.complement}
                    onChange={(e) => setDeliveryData({...deliveryData, complement: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="neighborhood">Bairro</label>
                <input 
                  type="text" 
                  id="neighborhood" 
                  value={deliveryData.neighborhood}
                  onChange={(e) => setDeliveryData({...deliveryData, neighborhood: e.target.value})}
                  readOnly
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Cidade</label>
                  <input 
                    type="text" 
                    id="city" 
                    value={deliveryData.city}
                    onChange={(e) => setDeliveryData({...deliveryData, city: e.target.value})}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Estado</label>
                  <input 
                    type="text" 
                    id="state" 
                    value={deliveryData.state}
                    onChange={(e) => setDeliveryData({...deliveryData, state: e.target.value})}
                    readOnly
                  />
                </div>
              </div>
            </form>
            
            {shippingOptions.length > 0 && (
              <div className="shipping-options">
                <h3>Opções de Frete</h3>
                {shippingOptions.map((option) => (
                  <div 
                    key={option.Codigo} 
                    className={`shipping-option ${selectedShipping?.Codigo === option.Codigo ? 'selected' : ''}`}
                    onClick={() => setSelectedShipping(option)}
                  >
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={selectedShipping?.Codigo === option.Codigo}
                      onChange={() => {}}
                    />
                    <div className="shipping-info">
                      <span className="shipping-name">{option.nome}</span>
                      <span className="shipping-details">
                        {option.PrazoEntrega} dias úteis • R$ {option.Valor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="order-total-section">
            <div className="order-summary-row">
              <span>Subtotal</span>
              <span>R$ {calculateItemsTotal()}</span>
            </div>
            <div className="order-summary-row">
              <span>Frete</span>
              <span>{selectedShipping ? `R$ ${selectedShipping.Valor}` : 'Calcular frete'}</span>
            </div>
            <div className="order-total-row">
              <span>Total</span>
              <span>R$ {calculateTotal()}</span>
            </div>
            
            {preferenceId ? (
              <div className="mercado-pago-button">
                <Wallet initialization={{ preferenceId }} />
                <button 
                  className="back-to-cart-btn"
                  onClick={() => setPreferenceId(null)}
                >
                  Voltar e editar
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={!selectedShipping || cartItems.length === 0 || isLoading}
              >
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;