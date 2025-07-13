import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('adminToken');
      const adminStatus = localStorage.getItem('isAdmin');

      if (!token || adminStatus !== 'true') {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8082/api/admin/auth/validate', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminUsername');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Erreur de validation:', err);
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, []);

  if (isValidating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Vérification de l'authentification...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 