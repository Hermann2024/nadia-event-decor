#!/usr/bin/env python3
"""
Script pour créer une playlist YouTube avec toutes les vidéos Nadia Event's Decor
"""

import json
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Configuration YouTube API
SCOPES = ['https://www.googleapis.com/auth/youtube']
API_NAME = 'youtube'
API_VERSION = 'v3'
CLIENT_SECRETS_FILE = 'client_secrets.json'

def get_authenticated_service():
    """Authentification avec l'API YouTube"""
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
    
    return build(API_NAME, API_VERSION, credentials=credentials)

def create_playlist(youtube, title, description):
    """Créer une nouvelle playlist"""
    try:
        playlist = youtube.playlists().insert(
            part='snippet,status',
            body={
                'snippet': {
                    'title': title,
                    'description': description,
                    'tags': ['nadia event\'s decor', 'décoration', 'événementiel', 'cameroun', 'yaoundé'],
                    'defaultLanguage': 'fr'
                },
                'status': {
                    'privacyStatus': 'public'
                }
            }
        ).execute()
        
        print(f"✅ Playlist créée: {playlist['snippet']['title']}")
        print(f"🔗 Lien: https://www.youtube.com/playlist?list={playlist['id']}")
        return playlist['id']
        
    except HttpError as e:
        print(f"❌ Erreur lors de la création de la playlist: {e}")
        return None

def add_video_to_playlist(youtube, playlist_id, video_id):
    """Ajouter une vidéo à la playlist"""
    try:
        youtube.playlistItems().insert(
            part='snippet',
            body={
                'snippet': {
                    'playlistId': playlist_id,
                    'resourceId': {
                        'kind': 'youtube#video',
                        'videoId': video_id
                    }
                }
            }
        ).execute()
        
        print(f"✅ Vidéo ajoutée à la playlist")
        return True
        
    except HttpError as e:
        print(f"❌ Erreur lors de l'ajout de la vidéo: {e}")
        return False

def main():
    """Fonction principale"""
    print("📋 Création de la playlist YouTube Nadia Event's Decor")
    print("=" * 60)
    
    # Vérifier si le rapport d'upload existe
    if not os.path.exists('upload_report.json'):
        print("❌ Fichier upload_report.json manquant!")
        print("📝 Veuillez d'abord uploader les vidéos avec upload-videos.py")
        return
    
    # Charger le rapport d'upload
    with open('upload_report.json', 'r', encoding='utf-8') as f:
        uploaded_videos = json.load(f)
    
    if not uploaded_videos:
        print("❌ Aucune vidéo uploadée trouvée dans le rapport")
        return
    
    # Authentification
    try:
        youtube = get_authenticated_service()
        print("✅ Authentification réussie!")
    except Exception as e:
        print(f"❌ Erreur d'authentification: {e}")
        return
    
    # Créer la playlist
    playlist_title = "Nadia Event's Decor - Décoration Événementielle"
    playlist_description = """�� Découvrez l'excellence de la décoration événementielle avec Nadia Event's Decor !

📋 Cette playlist présente nos meilleures créations :
• Décoration de mariage élégante
• Arches de mariage spectaculaires  
• Événements d'entreprise professionnels
• Anniversaires et célébrations
• Baptêmes et communions
• Éclairage et ambiance
• Décoration de tables élégantes
• Présentation de nos services

📞 Contactez-nous :
• +237 680 207 496
• +237 657 759 510
• +237 699 275 786

🌐 Site web : nadiaevents.com
📍 Yaoundé, Cameroun

#NadiaEvents #Décoration #Événementiel #Cameroun #Yaoundé #Mariage #Entreprise"""
    
    playlist_id = create_playlist(youtube, playlist_title, playlist_description)
    
    if not playlist_id:
        return
    
    # Ajouter les vidéos à la playlist
    print(f"\n📤 Ajout de {len(uploaded_videos)} vidéos à la playlist...")
    
    added_count = 0
    for video in uploaded_videos:
        if add_video_to_playlist(youtube, playlist_id, video['video_id']):
            added_count += 1
            print(f"   ✅ {video['title']}")
    
    print(f"\n📊 Résumé:")
    print(f"   • {added_count}/{len(uploaded_videos)} vidéos ajoutées à la playlist")
    print(f"   🔗 Playlist: https://www.youtube.com/playlist?list={playlist_id}")
    
    # Sauvegarder les informations de la playlist
    playlist_info = {
        'playlist_id': playlist_id,
        'playlist_title': playlist_title,
        'playlist_url': f"https://www.youtube.com/playlist?list={playlist_id}",
        'videos_count': added_count,
        'videos': uploaded_videos
    }
    
    with open('playlist_info.json', 'w', encoding='utf-8') as f:
        json.dump(playlist_info, f, indent=2, ensure_ascii=False)
    
    print("📄 Informations de la playlist sauvegardées dans playlist_info.json")

if __name__ == '__main__':
    main() 