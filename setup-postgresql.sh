#!/bin/bash

echo "🗄️  Configuration de PostgreSQL pour Nadia Event's Decor"
echo "======================================================"

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "📦 Installation de PostgreSQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql@14
        brew services start postgresql@14
        echo "✅ PostgreSQL installé et démarré sur macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
        echo "✅ PostgreSQL installé et démarré sur Linux"
    else
        echo "❌ Système d'exploitation non supporté"
        exit 1
    fi
else
    echo "✅ PostgreSQL est déjà installé"
fi

# Vérifier si PostgreSQL est démarré
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "🚀 Démarrage de PostgreSQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@14
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start postgresql
    fi
    sleep 3
fi

# Créer l'utilisateur postgres si nécessaire
echo "👤 Configuration de l'utilisateur postgres..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - créer l'utilisateur postgres
    createuser -s postgres 2>/dev/null || echo "Utilisateur postgres existe déjà"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - utiliser l'utilisateur postgres par défaut
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null || echo "Mot de passe déjà configuré"
fi

# Créer la base de données
echo "📊 Création de la base de données nadia_events..."
createdb -h localhost -U postgres nadia_events 2>/dev/null || echo "Base de données nadia_events existe déjà"

# Tester la connexion
echo "🔍 Test de connexion à la base de données..."
if psql -h localhost -U postgres -d nadia_events -c "SELECT version();" &> /dev/null; then
    echo "✅ Connexion à PostgreSQL réussie!"
    echo ""
    echo "📋 Configuration PostgreSQL:"
    echo "   • Host: localhost"
    echo "   • Port: 5432"
    echo "   • Database: nadia_events"
    echo "   • Username: postgres"
    echo "   • Password: postgres"
    echo ""
    echo "🚀 Vous pouvez maintenant démarrer les services:"
    echo "   ./launch-all-services-fixed.sh"
else
    echo "❌ Erreur de connexion à PostgreSQL"
    echo "   Vérifiez que PostgreSQL est démarré et accessible"
    exit 1
fi 