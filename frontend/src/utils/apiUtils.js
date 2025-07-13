// Utilitaires pour les appels API
export const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Erreur de réponse du serveur
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // Erreur de réseau
    return 'Erreur de connexion au serveur';
  } else {
    // Erreur de configuration
    return error.message || defaultMessage;
  }
};

export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}; 