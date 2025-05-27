import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Erro ao carregar usuários');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleDelete = async (userId) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
            setSuccessMessage('Usuário deletado com sucesso!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao deletar usuário');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando usuários...</p>
            </div>
        );
    }

    return (
        <div className="user-dashboard">
            <h2>Gerenciamento de Usuários</h2>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)} className="close-btn">×</button>
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                    <button onClick={() => setSuccessMessage(null)} className="close-btn">×</button>
                </div>
            )}

            <div className="controls">
                <input
                    type="text"
                    placeholder="Buscar usuários por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button
                    onClick={() => navigate('/users/new')}
                    className="add-user-btn"
                >
                    + Adicionar Usuário
                </button>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="no-results">
                    {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                </div>
            ) : (
                <div className="user-list">
                    {filteredUsers.map(u => (
                        <div key={u._id} className="user-card">
                            <div className="user-info">
                                <h3>{u.email}</h3>
                                <p>Registrado em: {new Date(u.createdAt).toLocaleDateString()}</p>
                                {user?._id === u._id && <span className="current-user">Você</span>}
                            </div>
                            <div className="user-actions">
                                <button
                                    onClick={() => navigate(`/users/edit/${u._id}`)}
                                    className="edit-btn"
                                    disabled={user?._id === u._id}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(u._id)}
                                    className="delete-btn"
                                    disabled={user?._id === u._id}
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default UserDashboard;