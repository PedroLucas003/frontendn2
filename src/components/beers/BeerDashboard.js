import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BeerDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BeerDashboard = () => {
  const [beers, setBeers] = useState([]);
  const [formData, setFormData] = useState({
    beerType: '',
    description: '',
    alcoholContent: '',
    yearCreated: '',
    quantity: 0,
    price: 15.90
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchBeers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_URL}/api/beers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Garante que os preços sejam números
      const beersWithValidPrices = response.data.map(beer => ({
        ...beer,
        price: Number(beer.price) || 0,
        quantity: Number(beer.quantity) || 0
      }));
      
      setBeers(beersWithValidPrices);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Erro ao carregar cervejas');
        console.error('Erro ao carregar cervejas:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (formData.quantity < 0 || formData.price <= 0) {
        throw new Error('Quantidade e preço devem ser valores positivos');
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/beers/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/beers`, formData, config);
      }
      
      setFormData({
        beerType: '',
        description: '',
        alcoholContent: '',
        yearCreated: '',
        quantity: 0,
        price: 15.90
      });
      setEditingId(null);
      await fetchBeers();
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError(err.response?.data?.error || err.message || 'Erro ao salvar cerveja');
        console.error('Erro ao salvar cerveja:', err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (beer) => {
    setFormData({
      beerType: beer.beerType || '',
      description: beer.description || '',
      alcoholContent: beer.alcoholContent || '',
      yearCreated: beer.yearCreated || '',
      quantity: Number(beer.quantity) || 0,
      price: Number(beer.price) || 15.90
    });
    setEditingId(beer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cerveja?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/beers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchBeers();
      } catch (err) {
        setError('Erro ao excluir cerveja');
        console.error('Erro ao excluir cerveja:', err);
      }
    }
  };

  return (
    <div className="beer-dashboard">
      <h2>Gerenciamento de Cervejas</h2>
      
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="beer-form">
            <div className="form-group">
              <label>Tipo:</label>
              <input
                type="text"
                name="beerType"
                value={formData.beerType}
                onChange={handleChange}
                required
                placeholder="Ex: IPA, Pilsen"
              />
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teor Alcoólico:</label>
                <input
                  type="text"
                  name="alcoholContent"
                  value={formData.alcoholContent}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 5.0% ABV"
                />
              </div>
              <div className="form-group">
                <label>Ano de Criação:</label>
                <input
                  type="text"
                  name="yearCreated"
                  value={formData.yearCreated}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 1923"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantidade:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Preço (R$):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="submitting-text">
                  {editingId ? 'Atualizando...' : 'Adicionando...'}
                </span>
              ) : (
                editingId ? 'Atualizar' : 'Adicionar'
              )}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setFormData({
                    beerType: '',
                    description: '',
                    alcoholContent: '',
                    yearCreated: '',
                    quantity: 0,
                    price: 15.90
                  });
                  setEditingId(null);
                }}
                className="cancel-btn"
              >
                Cancelar
              </button>
            )}
          </form>

          <div className="beer-list">
            <h3>Estoque Atual</h3>
            {beers.length === 0 ? (
              <p>Nenhuma cerveja cadastrada</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Teor</th>
                    <th>Ano</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {beers.map(beer => (
                    <tr key={beer._id}>
                      <td>{beer.beerType}</td>
                      <td>{beer.description}</td>
                      <td>{beer.alcoholContent}</td>
                      <td>{beer.yearCreated}</td>
                      <td>{beer.quantity}</td>
                      <td>R$ {beer.price?.toFixed ? beer.price.toFixed(2) : '0.00'}</td>
                      <td>
                        <button onClick={() => handleEdit(beer)}>Editar</button>
                        <button onClick={() => handleDelete(beer._id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BeerDashboard;