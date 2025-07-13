#!/bin/bash

echo "🎬 Nadia Event's Decor - Upload Complet vers YouTube"
echo "=================================================="
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f "upload-videos.py" ]; then
    echo "❌ Veuillez exécuter ce script depuis le dossier scripts/"
    echo "   cd scripts && ./upload-all-videos.sh"
    exit 1
fi

# Vérifier si Python 3 est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    echo "   Sur macOS: brew install python3"
    echo "   Sur Ubuntu: sudo apt-get install python3 python3-pip"
    exit 1
fi

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "📦 Environnement virtuel manquant. Configuration en cours..."
    chmod +x setup-youtube-upload.sh
    ./setup-youtube-upload.sh
    echo ""
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Vérifier si client_secrets.json existe
if [ ! -f "client_secrets.json" ]; then
    echo "❌ Fichier client_secrets.json manquant!"
    echo ""
    echo "📝 Configuration requise:"
    echo "1. 🌐 Allez sur https://console.cloud.google.com/"
    echo "2. 📋 Créez un projet ou sélectionnez un projet existant"
    echo "3. 🔌 Activez l'API YouTube Data v3"
    echo "4. 🔑 Créez des identifiants OAuth 2.0 (Application de bureau)"
    echo "5. 📥 Téléchargez client_secrets.json"
    echo "6. 📁 Placez-le dans le dossier scripts/"
    echo ""
    echo "🔗 Liens directs:"
    echo "   • API YouTube: https://console.cloud.google.com/apis/library/youtube.googleapis.com"
    echo "   • Identifiants: https://console.cloud.google.com/apis/credentials"
    echo ""
    echo "📄 Exemple de structure dans client_secrets_example.json"
    echo ""
fi

echo "✅ Configuration détectée!"
echo ""

# Menu principal
while true; do
    echo "🎯 Que souhaitez-vous faire ?"
    echo ""
    echo "1. 🔍 Tester la configuration"
    echo "2. 📤 Uploader toutes les vidéos vers YouTube"
    echo "3. 📋 Créer une playlist avec les vidéos uploadées"
    echo "4. 🔄 Uploader ET créer la playlist (recommandé)"
    echo "5. 📊 Voir le rapport d'upload existant"
    echo "6. 🗑️  Supprimer les fichiers de rapport"
    echo "7. ❌ Quitter"
    echo ""
    read -p "Votre choix (1-7): " choice
    
    case $choice in
        1)
            echo ""
            echo "🔍 Test de la configuration..."
            python3 test-config.py
            echo ""
            ;;
        2)
            echo ""
            echo "📤 Lancement de l'upload des vidéos..."
            python3 upload-videos.py
            echo ""
            ;;
        3)
            echo ""
            echo "📋 Création de la playlist..."
            python3 create-playlist.py
            echo ""
            ;;
        4)
            echo ""
            echo "🔄 Upload complet en cours..."
            echo "📤 Étape 1: Upload des vidéos..."
            python3 upload-videos.py
            echo ""
            echo "📋 Étape 2: Création de la playlist..."
            python3 create-playlist.py
            echo ""
            echo "✅ Processus terminé!"
            ;;
        5)
            echo ""
            if [ -f "upload_report.json" ]; then
                echo "📊 Rapport d'upload:"
                python3 -c "
import json
with open('upload_report.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f'Vidéos uploadées: {len(data)}')
for video in data:
    print(f'• {video[\"title\"]}')
    print(f'  🔗 {video[\"url\"]}')
"
            else
                echo "❌ Aucun rapport d'upload trouvé"
            fi
            echo ""
            ;;
        6)
            echo ""
            echo "🗑️  Suppression des fichiers de rapport..."
            rm -f upload_report.json playlist_info.json token.json
            echo "✅ Fichiers supprimés"
            echo ""
            ;;
        7)
            echo ""
            echo "👋 Au revoir!"
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Choix invalide. Veuillez choisir 1-7."
            echo ""
            ;;
    esac
done 