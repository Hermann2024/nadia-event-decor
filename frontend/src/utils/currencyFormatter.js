/**
 * Utilitaire de formatage de devise personnalisé
 * Évite les problèmes d'affichage avec les barres obliques et autres caractères incorrects
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 FCFA';
  }

  // Convertir en nombre et arrondir à 0 décimales
  const numAmount = Math.round(parseFloat(amount));
  
  // Formater avec des espaces comme séparateurs de milliers
  const formattedNumber = numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Retourner avec la devise
  return `${formattedNumber} FCFA`;
};

export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  // Convertir en nombre et arrondir à 0 décimales
  const numAmount = Math.round(parseFloat(amount));
  
  // Formater avec des espaces comme séparateurs de milliers
  return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatDecimal = (amount, decimals = 0) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  // Convertir en nombre et formater avec le nombre de décimales spécifié
  const numAmount = parseFloat(amount);
  const formattedNumber = numAmount.toFixed(decimals);
  
  // Remplacer le point par une virgule pour la locale française
  return formattedNumber.replace('.', ',');
}; 