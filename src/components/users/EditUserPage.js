import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUserPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EditUserPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          email: response.data.email,
          isAdmin: response.data.isAdmin || false
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar usuário');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Usuário atualizado com sucesso!');
      setTimeout(() => navigate('/users'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar usuário');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando usuário...</p>
      </div>
    );
  }

  return (
    <div className="edit-user-container">
      <h2>Editar Usuário</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            Administrador
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/users')}
            className="cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;