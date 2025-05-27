import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }

        await axios.post(`${API_URL}/api/auth/register`, {
          email,
          password
        });

        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        });

        onLogin(loginResponse.data.token, loginResponse.data.user);
      } else {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        });

        onLogin(response.data.token, response.data.user);
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Ocorreu um erro. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? 'Registrar' : 'Login'}</h2>
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
              placeholder="••••••"
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Confirmar Senha:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="6"
                required
                placeholder="••••••"
              />
            </div>
          )}
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading 
              ? (isRegistering ? 'Registrando...' : 'Entrando...') 
              : (isRegistering ? 'Registrar' : 'Entrar')}
          </button>

          <div className="toggle-mode">
            <button 
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Registre-se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;