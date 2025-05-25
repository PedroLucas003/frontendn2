import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });

      onLogin(response.data.token, response.data.user);
    } catch (error) {
      setError(error.response?.data?.error || 'Ocorreu um erro. Tente novamente.');
      console.error('Erro na autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>
      
      {error && <div className="alert error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Registrar'}
        </button>
      </form>
      
      <p>
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          className="switch-mode"
        >
          {isLogin ? 'Registre-se' : 'Faça login'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;