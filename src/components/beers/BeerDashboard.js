import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './BeerDashboard.css';

const BeerDashboard = ({ user }) => {
  const [beers, setBeers] = useState([]);
  const [selectedBeer, setSelectedBeer] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const beerTypes = ['Pilsen', 'IPA', 'Stout', 'Weiss'];

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  const fetchBeers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/beers', getAuthHeader());
      setBeers(response.data);
    } catch (error) {
      setError('Erro ao buscar cervejas. Tente novamente.');
      console.error('Erro ao buscar cervejas:', error);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchBeers();
  }, [fetchBeers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const beerData = { beerType: selectedBeer, quantity };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/beers/${editingId}`,
          beerData,
          getAuthHeader()
        );
        setSuccess('Cerveja atualizada com sucesso!');
      } else {
        await axios.post(
          'http://localhost:5000/api/beers',
          beerData,
          getAuthHeader()
        );
        setSuccess('Cerveja adicionada com sucesso!');
      }

      await fetchBeers();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao salvar cerveja');
      console.error('Erro ao salvar cerveja:', error);
    }
  };

  const handleEdit = (beer) => {
    setSelectedBeer(beer.beerType);
    setQuantity(beer.quantity);
    setEditingId(beer._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta cerveja?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/beers/${id}`,
          getAuthHeader()
        );
        setSuccess('Cerveja excluída com sucesso!');
        await fetchBeers();
      } catch (error) {
        setError('Erro ao excluir cerveja');
        console.error('Erro ao excluir cerveja:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedBeer('');
    setQuantity(0);
    setEditingId(null);
  };

  return (
    <div className="dashboard-container">
      <h2>Bem-vindo, {user?.email}</h2>
      <h3>Gerenciamento de Estoque</h3>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="beer-form">
        <div className="form-group">
          <label>Tipo de Cerveja:</label>
          <select
            value={selectedBeer}
            onChange={(e) => setSelectedBeer(e.target.value)}
            required
          >
            <option value="">Selecione um tipo</option>
            {beerTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="beer-list">
        <h3>Estoque Atual</h3>
        {beers.length === 0 ? (
          <p>Nenhuma cerveja em estoque</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {beers.map((beer) => (
                <tr key={beer._id}>
                  <td>{beer.beerType}</td>
                  <td>{beer.quantity}</td>
                  <td>{new Date(beer.updatedAt || beer.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(beer)}
                      className="btn edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(beer._id)}
                      className="btn delete"
                    >
                      Excluir
                    </button>
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