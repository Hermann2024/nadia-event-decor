#!/bin/bash

echo "🛑 Arrêt de tous les services Nadia Events Decor"
echo "================================================"

# Fonction pour arrêter un service
stop_service() {
    local service_name=$1
    local pid_file="logs/$service_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Arrêt de $service_name (PID: $pid)..."
            kill -TERM $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚠️  Force kill de $service_name..."
                kill -KILL $pid
            fi
            echo "✅ $service_name arrêté"
        else
            echo "ℹ️  $service_name n'était pas en cours d'exécution"
        fi
        rm -f "$pid_file"
    else
        echo "ℹ️  Fichier PID pour $service_name non trouvé"
    fi
}

# Arrêter les services Spring Boot
echo "📦 Arrêt des services backend..."

# 1. Eureka Server
stop_service "eureka-server"

# 2. Gateway Service
stop_service "gateway-service"

# 3. Admin Service
stop_service "admin-service"

# 4. Product Service
stop_service "product-service"

# 5. Frontend
stop_service "frontend"

# Arrêter les processus par port si nécessaire
echo "🔍 Nettoyage des ports..."

# Port 8761 (Eureka)
if lsof -Pi :8761 -sTCP:LISTEN -t >/dev/null ; then
    echo "🛑 Arrêt du processus sur le port 8761..."
    kill -9 $(lsof -ti:8761) 2>/dev/null
fi

# Port 8080 (Gateway)
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "🛑 Arrêt du processus sur le port 8080..."
    kill -9 $(lsof -ti:8080) 2>/dev/null
fi

# Port 8081 (Product Service)
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "🛑 Arrêt du processus sur le port 8081..."
    kill -9 $(lsof -ti:8081) 2>/dev/null
fi

# Port 8082 (Admin Service)
if lsof -Pi :8082 -sTCP:LISTEN -t >/dev/null ; then
    echo "🛑 Arrêt du processus sur le port 8082..."
    kill -9 $(lsof -ti:8082) 2>/dev/null
fi

# Port 3000 (Frontend)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "🛑 Arrêt du processus sur le port 3000..."
    kill -9 $(lsof -ti:3000) 2>/dev/null
fi

echo ""
echo "✅ Tous les services ont été arrêtés!"
echo ""
echo "🚀 Pour relancer les services:"
echo "   ./launch-all-services-fixed.sh" 