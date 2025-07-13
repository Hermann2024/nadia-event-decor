import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/admin');
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

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>�� Connexion Administrateur</h2>
        <p className="login-subtitle">Accès sécurisé à l'administration</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="login-info">
          <p><strong>Utilisateurs de test :</strong></p>
          <ul>
            <li><strong>admin</strong> / admin123</li>
            <li><strong>manager</strong> / manager123</li>
            <li><strong>nadia</strong> / nadia2024</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login; 