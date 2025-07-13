#!/usr/bin/env python3
"""
Script de test pour vérifier la configuration YouTube API
"""

import os
import json
from pathlib import Path

def test_configuration():
    """Tester la configuration"""
    print("🔍 Test de configuration YouTube API")
    print("=" * 40)
    
    # Vérifier Python
    print("✅ Python 3 détecté")
    
    # Vérifier l'environnement virtuel
    if os.path.exists('venv'):
        print("✅ Environnement virtuel trouvé")
    else:
        print("❌ Environnement virtuel manquant")
        return False
    
    # Vérifier les dépendances
    try:
        import google.auth
        import googleapiclient
        print("✅ Dépendances Python installées")
    except ImportError as e:
        print(f"❌ Dépendances manquantes: {e}")
        return False
    
    # Vérifier client_secrets.json
    if os.path.exists('client_secrets.json'):
        try:
            with open('client_secrets.json', 'r') as f:
                config = json.load(f)
            
            if 'installed' in config:
                client_id = config['installed'].get('client_id', '')
                if client_id and 'googleusercontent.com' in client_id:
                    print("✅ client_secrets.json valide")
                else:
                    print("❌ client_secrets.json invalide - client_id incorrect")
                    return False
            else:
                print("❌ client_secrets.json invalide - format incorrect")
                return False
        except json.JSONDecodeError:
            print("❌ client_secrets.json invalide - JSON malformé")
            return False
    else:
        print("❌ client_secrets.json manquant")
        print("📝 Téléchargez-le depuis: https://console.cloud.google.com/apis/credentials")
        return False
    
    # Vérifier les vidéos
    videos_dir = Path("../assets/images")
    if videos_dir.exists():
        video_files = list(videos_dir.glob("*.MP4"))
        if video_files:
            print(f"✅ {len(video_files)} vidéos trouvées")
            for video in video_files:
                print(f"   • {video.name}")
        else:
            print("❌ Aucune vidéo MP4 trouvée")
            return False
    else:
        print("❌ Dossier assets/images introuvable")
        return False
    
    print("\n🎯 Configuration prête pour l'upload!")
    return True

def test_authentication():
    """Tester l'authentification"""
    print("\n🔐 Test d'authentification...")
    
    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
        
        SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
        CLIENT_SECRETS_FILE = 'client_secrets.json'
        
        credentials = None
        if os.path.exists('token.json'):
            credentials = json.load(open('token.json'))
        
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
                credentials = flow.run_local_server(port=0)
            
            with open('token.json', 'w') as token:
                token.write(credentials.to_json())
        
        youtube = build('youtube', 'v3', credentials=credentials)
        
        # Test simple - récupérer les informations du compte
        channels_response = youtube.channels().list(
            part='snippet',
            mine=True
        ).execute()
        
        if channels_response['items']:
            channel = channels_response['items'][0]
            print(f"✅ Authentification réussie!")
            print(f"   📺 Chaîne: {channel['snippet']['title']}")
            return True
        else:
            print("❌ Aucune chaîne trouvée")
            return False
            
    except Exception as e:
        print(f"❌ Erreur d'authentification: {e}")
        return False

if __name__ == '__main__':
    if test_configuration():
        test_authentication()
    else:
        print("\n❌ Configuration incomplète. Veuillez corriger les erreurs ci-dessus.") 