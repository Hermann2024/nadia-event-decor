#!/bin/bash

echo "🔄 Forcer l'utilisation de PostgreSQL pour l'admin-service"
echo "========================================================"

# Arrêter le service admin
echo "🛑 Arrêt du service admin..."
pkill -f "admin-service"
sleep 3

# Vérifier que PostgreSQL fonctionne
echo "🔍 Vérification de PostgreSQL..."
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "❌ PostgreSQL n'est pas accessible"
    exit 1
fi

echo "✅ PostgreSQL est accessible"

# Vérifier que les données sont dans PostgreSQL
echo "📊 Vérification des données dans PostgreSQL..."
psql -h localhost -U postgres -d nadia_events -c "SELECT COUNT(*) as factures FROM invoices; SELECT COUNT(*) as devis FROM quotes;"

# Redémarrer le service admin avec la configuration PostgreSQL
echo "🚀 Redémarrage du service admin avec PostgreSQL..."
cd admin-service
nohup mvn spring-boot:run > ../logs/admin-postgresql.log 2>&1 &
echo $! > ../logs/admin-postgresql.pid

echo "⏳ Attente du démarrage du service..."
sleep 20

# Tester l'API
echo "🧪 Test de l'API..."
curl -s http://localhost:8082/api/admin/invoices | jq .

echo ""
echo "✅ Script terminé. Vérifiez les logs dans logs/admin-postgresql.log" 