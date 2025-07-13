// Test du formatage des devises
const formatCurrency = (amount) => {
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

// Tests
console.log('Test du formatage des devises:');
console.log('180 FCFA ->', formatCurrency(180));
console.log('2700 FCFA ->', formatCurrency(2700));
console.log('1300 FCFA ->', formatCurrency(1300));
console.log('300 FCFA ->', formatCurrency(300));
console.log('2500000 FCFA ->', formatCurrency(2500000));
console.log('0 FCFA ->', formatCurrency(0));
console.log('null ->', formatCurrency(null));
console.log('undefined ->', formatCurrency(undefined));
console.log('"abc" ->', formatCurrency("abc")); 