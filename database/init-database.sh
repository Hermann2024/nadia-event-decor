#!/bin/bash

echo "🗄️  Initialisation de la base de données Nadia Events Decor"
echo "=========================================================="

# Vérifier si MySQL est installé
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé. Veuillez installer MySQL 8.0+"
    echo "   Sur macOS: brew install mysql"
    echo "   Sur Ubuntu: sudo apt-get install mysql-server"
    exit 1
fi

# Vérifier si MySQL est démarré
if ! mysqladmin ping -h localhost -u root --password=root 2>/dev/null; then
    echo "⚠️  MySQL n'est pas démarré ou les identifiants sont incorrects."
    echo "   Démarrez MySQL et vérifiez les identifiants dans les fichiers application.yml"
    echo "   Identifiants par défaut: root/root"
    exit 1
fi

echo "📦 Création de la base de données et des tables..."

# Exécuter le script SQL
mysql -u root -proot < database/init.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de données initialisée avec succès!"
    echo ""
    echo "📊 Tables créées:"
    echo "   • products - Produits de décoration"
    echo "   • users - Utilisateurs du système"
    echo "   • quotes - Devis clients"
    echo "   • quote_items - Éléments des devis"
    echo "   • payments - Paiements"
    echo "   • messages - Messages de contact"
    echo "   • reviews - Avis clients"
    echo "   • announcements - Annonces"
    echo ""
    echo "🔑 Compte admin créé:"
    echo "   • Username: admin"
    echo "   • Email: admin@nadiaevents.com"
    echo "   • Mot de passe: admin123"
    echo ""
    echo "📦 Données de test insérées (5 produits, 1 annonce)"
    echo ""
    echo "🌐 Vous pouvez maintenant démarrer les services:"
    echo "   ./start-backend.sh"
else
    echo "❌ Erreur lors de l'initialisation de la base de données"
    exit 1
fi 