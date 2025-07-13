#!/bin/bash

echo "🛑 Arrêt du système de chat Nadia Events Decor"
echo "==============================================="

# Arrêter le service admin
if [ -f logs/admin.pid ]; then
    echo "🔧 Arrêt du service admin..."
    kill $(cat logs/admin.pid) 2>/dev/null
    rm logs/admin.pid
    echo "✅ Service admin arrêté"
else
    echo "ℹ️  Service admin déjà arrêté"
fi

# Arrêter le frontend
if [ -f logs/frontend.pid ]; then
    echo "🌐 Arrêt du frontend..."
    kill $(cat logs/frontend.pid) 2>/dev/null
    rm logs/frontend.pid
    echo "✅ Frontend arrêté"
else
    echo "ℹ️  Frontend déjà arrêté"
fi

# Arrêter tous les processus Node.js et Java liés au projet
echo "🧹 Nettoyage des processus..."
pkill -f "nadia-events-decor" 2>/dev/null
pkill -f "admin-service" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null

echo "✅ Système de chat arrêté avec succès" 