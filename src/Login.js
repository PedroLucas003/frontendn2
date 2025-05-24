import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Configura o axios para usar a URL da API
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Verifica se já está logado
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/register' : '/login';
      const response = await axios.post(endpoint, {
        email,
        password
      });

      if (isRegistering) {
        alert('Cadastro realizado com sucesso! Faça login.');
        setIsRegistering(false);
        setEmail('');
        setPassword('');
      } else {
        // Armazena o token JWT
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', email);
        
        // Configura axios para enviar o token em requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        isRegistering 
          ? err.response?.data?.error || 'Falha no cadastro. Tente outro email.' 
          : err.response?.data?.error || 'Falha no login. Verifique suas credenciais.'
      );
      console.error('Erro:', err.response?.data || err.message);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginTop: '50px',
      backgroundColor: '#f9f9f9'
    },
    form: {
      display: 'flex',
      flexDirection: 'column'
    },
    formGroup: {
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column'
    },
    input: {
      padding: '10px',
      marginTop: '5px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    button: {
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      ':hover': {
        backgroundColor: '#0056b3'
      },
      ':disabled': {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed'
      }
    },
    toggleText: {
      textAlign: 'center',
      marginTop: '15px',
      color: '#666'
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: '0 5px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegistering ? 'Cadastro' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={!email || !password}
        >
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
      
      <p style={styles.toggleText}>
        {isRegistering ? 'Já tem conta? ' : 'Não tem conta? '}
        <button 
          type="button" 
          style={styles.toggleButton}
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
        >
          {isRegistering ? 'Faça login' : 'Cadastre-se'}
        </button>
      </p>
    </div>
  );
};

export default Login;