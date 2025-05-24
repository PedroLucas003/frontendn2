import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 Login Bem-Sucedido!</h1>
      <p style={styles.message}>Bem-vindo(a), <strong>{userEmail || 'usuário'}</strong>!</p>
      <p style={styles.submessage}>Você acessou a área protegida com sucesso.</p>
      <button 
        onClick={handleLogout}
        style={styles.button}
      >
        Sair do Sistema
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px'
  },
  message: {
    fontSize: '18px',
    color: '#34495e',
    margin: '10px 0'
  },
  submessage: {
    color: '#7f8c8d',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b'
    }
  }
};

export default Dashboard;