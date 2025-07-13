#!/bin/bash

echo "🎬 Configuration de l'upload YouTube pour Nadia Event's Decor"
echo "============================================================"

# Vérifier si Python 3 est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez installer Python 3.7+"
    echo "   Sur macOS: brew install python3"
    echo "   Sur Ubuntu: sudo apt-get install python3 python3-pip"
    exit 1
fi

echo "✅ Python 3 détecté: $(python3 --version)"

# Créer un environnement virtuel
echo "📦 Création de l'environnement virtuel..."
python3 -m venv venv

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo "📚 Installation des dépendances..."
pip install -r requirements.txt

echo ""
echo "🔑 Configuration de l'API YouTube"
echo "=================================="
echo ""
echo "📝 Pour utiliser ce script, vous devez:"
echo ""
echo "1. 🌐 Aller sur Google Cloud Console:"
echo "   https://console.cloud.google.com/"
echo ""
echo "2. 📋 Créer un nouveau projet ou sélectionner un projet existant"
echo ""
echo "3. 🔌 Activer l'API YouTube Data v3:"
echo "   https://console.cloud.google.com/apis/library/youtube.googleapis.com"
echo ""
echo "4. 🔑 Créer des identifiants OAuth 2.0:"
echo "   https://console.cloud.google.com/apis/credentials"
echo "   - Type: Application de bureau"
echo "   - Nom: Nadia Event's Decor Upload"
echo ""
echo "5. 📥 Télécharger le fichier client_secrets.json"
echo ""
echo "6. 📁 Placer le fichier client_secrets.json dans le dossier scripts/"
echo ""
echo "7. 🚀 Lancer l'upload:"
echo "   source venv/bin/activate"
echo "   python3 upload-videos.py"
echo ""

# Vérifier si client_secrets.json existe
if [ -f "client_secrets.json" ]; then
    echo "✅ client_secrets.json trouvé!"
    echo ""
    echo "🎯 Prêt pour l'upload! Lancez:"
    echo "   python3 upload-videos.py"
else
    echo "⚠️  client_secrets.json manquant!"
    echo "   Veuillez suivre les étapes ci-dessus pour le configurer."
fi

echo ""
echo "📋 Métadonnées configurées pour 8 vidéos:"
echo "   • Décoration de Mariage Élégante"
echo "   • Arches de Mariage Spectaculaires"
echo "   • Événements d'Entreprise Professionnels"
echo "   • Anniversaires et Célébrations"
echo "   • Baptêmes et Communions"
echo "   • Éclairage et Ambiance"
echo "   • Décoration de Tables Élégantes"
echo "   • Présentation de Nos Services"
echo ""
echo "📞 Contacts inclus dans les descriptions:"
echo "   • +237 680 207 496"
echo "   • +237 657 759 510"
echo "   • +237 699 275 786"
echo ""
echo "🌐 Site web: nadiaevents.com"
echo "📍 Localisation: Yaoundé, Cameroun" 