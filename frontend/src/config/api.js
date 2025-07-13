// Configuration des URLs API
const API_CONFIG = {
  // URLs directes vers les services (pour le développement)
  ADMIN_SERVICE: 'http://localhost:8082/api/admin',
  PRODUCT_SERVICE: 'http://localhost:8081/api/products',
  
  // URL du gateway (pour la production)
  GATEWAY: 'http://localhost:8080/api',
  
  // URL active (utiliser directement le service Admin)
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8082/api/admin'
};

export default API_CONFIG;
