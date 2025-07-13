import React, { useState, useEffect } from 'react';
import AdminPanel from '../components/AdminPanel';
import { useNavigate } from 'react-router-dom';
// import './Admin.css';
import './Login.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8082/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUsername', data.username);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch('http://localhost:8082/api/admin/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminUsername');
      setIsAuthenticated(false);
    }
  };

  // Si pas authentifié, afficher le formulaire de login
  if (!isAuthenticated) {
    return (
      <>
        <style>{`
          .admin-login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
          }
          .admin-login-box {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(34, 139, 34, 0.08);
            padding: 40px 32px 32px 32px;
            max-width: 350px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .admin-login-title {
            color: #218838;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .admin-login-subtitle {
            color: #4caf50;
            font-size: 1rem;
            margin-bottom: 24px;
          }
          .admin-login-form {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .admin-login-form label {
            color: #218838;
            font-weight: 500;
            margin-bottom: 6px;
            margin-top: 12px;
          }
          .admin-login-input {
            padding: 10px 14px;
            border: 1px solid #b2dfdb;
            border-radius: 8px;
            margin-bottom: 8px;
            font-size: 1rem;
            background: #f8fff8;
            transition: border 0.2s;
          }
          .admin-login-input:focus {
            border: 1.5px solid #43a047;
            outline: none;
          }
          .admin-login-button {
            background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 0;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(67, 160, 71, 0.08);
            transition: background 0.2s, box-shadow 0.2s;
          }
          .admin-login-button:hover {
            background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
            box-shadow: 0 4px 16px rgba(67, 160, 71, 0.15);
          }
          .admin-login-error {
            color: #c62828;
            background: #ffebee;
            border-radius: 6px;
            padding: 8px 12px;
            margin-top: 12px;
            font-size: 0.98rem;
            text-align: center;
          }
        `}</style>
        <div className="admin-login-container">
          <div className="admin-login-box">
            <h2 className="admin-login-title">Connexion Administrateur</h2>
            <p className="admin-login-subtitle">Accès sécurisé à l'administration</p>
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Entrez votre nom d'utilisateur"
                className="admin-login-input"
                autoComplete="username"
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Entrez votre mot de passe"
                className="admin-login-input"
                autoComplete="current-password"
              />
              <button type="submit" className="admin-login-button">Se connecter</button>
              {error && <div className="admin-login-error">{error}</div>}
            </form>
          </div>
        </div>
      </>
    );
  }

  // Si authentifié, afficher le panel admin
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Administration Nadia Events</h1>
        <div className="admin-user-info">
          <button onClick={handleLogout} className="logout-button logout-btn-custom">
            Déconnexion
          </button>
        </div>
      </div>
      
      <AdminPanel />
    </div>
  );
};

export default Admin; 