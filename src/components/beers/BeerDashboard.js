import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BeerDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BeerDashboard = () => {
  const [beers, setBeers] = useState([]);
  const [formData, setFormData] = useState({
    beerType: 'Pilsen',
    quantity: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const beerTypes = ['Pilsen', 'IPA', 'Stout', 'Weiss'];

  const fetchBeers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${API_URL}/api/beers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBeers(response.data);
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
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingId) {
        await axios.put(`${API_URL}/api/beers/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/beers`, formData, config);
      }
      
      setFormData({ beerType: 'Pilsen', quantity: 0 });
      setEditingId(null);
      await fetchBeers();
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      } else {
        setError('Erro ao salvar cerveja');
        console.error('Erro ao salvar cerveja:', err);
      }
    }
  };

  const handleEdit = (beer) => {
    setFormData({
      beerType: beer.beerType,
      quantity: beer.quantity
    });
    setEditingId(beer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cerveja?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/beers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
              <select
                name="beerType"
                value={formData.beerType}
                onChange={handleChange}
                required
              >
                {beerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

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

            <button type="submit" className="submit-btn">
              {editingId ? 'Atualizar' : 'Adicionar'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setFormData({ beerType: 'Pilsen', quantity: 0 });
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
                    <th>Quantidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {beers.map(beer => (
                    <tr key={beer._id}>
                      <td>{beer.beerType}</td>
                      <td>{beer.quantity}</td>
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