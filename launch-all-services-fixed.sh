#!/bin/bash

echo "=== Lancement de tous les services Nadia Events Decor ==="
echo ""

# Fonction pour lancer un service
launch_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "🚀 Lancement de $service_name sur le port $port..."
    cd "$service_path"
    
    # Vérifier si le port est libre
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Le port $port est déjà utilisé. Arrêt du processus..."
        kill -9 $(lsof -ti:$port) 2>/dev/null
        sleep 2
    fi
    
    # Lancer le service en arrière-plan
    nohup mvn spring-boot:run > ../logs/$service_name.log 2>&1 &
    echo $! > ../logs/$service_name.pid
    
    echo "✅ $service_name lancé (PID: $(cat ../logs/$service_name.pid))"
    sleep 5
    
    # IMPORTANT: Retourner à la racine
    cd ..
}

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

echo "📁 Création du dossier logs..."
echo ""

# 1. Eureka Server (port 8761)
echo "=== 1. Eureka Server ==="
launch_service "eureka-server" "eureka-server" 8761

# 2. Gateway Service (port 8080)
echo "=== 2. Gateway Service ==="
launch_service "gateway-service" "gateway-service" 8080

# 3. Admin Service (port 8082)
echo "=== 3. Admin Service ==="
launch_service "admin-service" "admin-service" 8082

# 4. Product Service (port 8081)
echo "=== 4. Product Service ==="
launch_service "product-service" "product-service" 8081

# 5. Frontend Angular (port 3000) - seulement si Node.js est à jour
echo "=== 5. Frontend Angular ==="
echo "�� Lancement du Frontend Angular sur le port 3000..."
cd frontend

# Vérifier la version de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Node.js version $(node --version) détectée. Version 20+ requise pour Angular."
    echo "⏭️  Skipping frontend launch. Please update Node.js first."
    cd ..
else
    # Vérifier si le port 3000 est libre
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Le port 3000 est déjà utilisé. Arrêt du processus..."
        kill -9 $(lsof -ti:3000) 2>/dev/null
        sleep 2
    fi

    # Lancer le frontend en arrière-plan
    nohup npm start > ../logs/frontend.log 2>&1 &
    echo $! > ../logs/frontend.pid
    echo "✅ Frontend Angular lancé (PID: $(cat ../logs/frontend.pid))"
    cd ..
fi

echo ""
echo "🎉 Services backend lancés avec succès !"
echo ""
echo "📊 Statut des services :"
echo "   �� Eureka Server:     http://localhost:8761"
echo "   �� Gateway Service:   http://localhost:8080"
echo "   👨‍�� Admin Service:     http://localhost:8082"
echo "   �� Product Service:   http://localhost:8081"
if [ "$NODE_VERSION" -ge 20 ]; then
    echo "   �� Frontend:          http://localhost:3000"
else
    echo "   ⚠️  Frontend:          Node.js v20+ requis"
fi
echo ""
echo "📝 Logs disponibles dans le dossier logs/"
echo "🛑 Pour arrêter tous les services: ./stop-all-services.sh"
echo ""
echo "⏳ Attendez quelques secondes que tous les services démarrent complètement..."
