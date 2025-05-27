import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BeerDashboard.css';

const BeerDashboard = () => {
  const [beers, setBeers] = useState([]);
  const [formData, setFormData] = useState({
    beerType: 'Pilsen',
    quantity: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const beerTypes = ['Pilsen', 'IPA', 'Stout', 'Weiss'];

  // Buscar cervejas
  const fetchBeers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/beers');
      setBeers(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar cervejas');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBeers();
  }, []);

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/beers/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/beers', formData);
      }
      fetchBeers();
      setFormData({ beerType: 'Pilsen', quantity: 0 });
      setEditingId(null);
    } catch (err) {
      setError('Erro ao salvar cerveja');
      console.error(err);
    }
  };

  // Editar cerveja
  const handleEdit = (beer) => {
    setFormData({
      beerType: beer.beerType,
      quantity: beer.quantity
    });
    setEditingId(beer._id);
  };

  // Deletar cerveja
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cerveja?')) {
      try {
        await axios.delete(`http://localhost:5000/api/beers/${id}`);
        fetchBeers();
      } catch (err) {
        setError('Erro ao excluir cerveja');
        console.error(err);
      }
    }
  };

  return (
    <div className="beer-dashboard">
      <h2>Gerenciamento de Cervejas</h2>
      
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
    </div>
  );
};

export default BeerDashboard;