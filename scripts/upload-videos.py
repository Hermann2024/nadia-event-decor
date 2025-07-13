#!/usr/bin/env python3
"""
Script d'upload automatique des vidéos Nadia Event's Decor vers YouTube
Utilise l'API YouTube Data v3 pour uploader les vidéos avec métadonnées optimisées
"""

import os
import sys
import json
import time
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from googleapiclient import upload

# Configuration YouTube API
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
API_NAME = 'youtube'
API_VERSION = 'v3'
CLIENT_SECRETS_FILE = 'client_secrets.json'

# Métadonnées pour les vidéos Nadia Event's Decor
VIDEO_METADATA = {
    "1a3cfdf2-5bfe-490e-8943-e9fc11e47bcb.MP4": {
        "title": "Nadia Event's Decor - Décoration de Mariage Élégante",
        "description": "Découvrez nos magnifiques décorations de mariage créées par Nadia Event's Decor. Transformez votre journée spéciale en un événement inoubliable avec nos services de décoration professionnels.\n\n📞 Contact: +237 680 207 496\n🌐 Site: nadiaevents.com\n📍 Yaoundé, Cameroun\n\n#Mariage #Décoration #NadiaEvents #Cameroun #Événementiel",
        "tags": ["mariage", "décoration", "événementiel", "cameroun", "nadia event's decor", "yaoundé", "déco mariage"],
        "category": "22"  # People & Blogs
    },
    "4d1805a2-c1d6-408f-b201-627b7fc9a1ca.MP4": {
        "title": "Nadia Event's Decor - Arches de Mariage Spectaculaires",
        "description": "Nos arches de mariage personnalisées créent une ambiance romantique et élégante pour votre cérémonie. Chaque détail est soigneusement choisi pour rendre votre mariage unique.\n\n💒 Arches personnalisées\n🌺 Décoration florale\n✨ Éclairage d'ambiance\n\n📞 Contact: +237 657 759 510\n🌐 Site: nadiaevents.com\n\n#ArchesMariage #Décoration #NadiaEvents",
        "tags": ["arches mariage", "décoration", "cérémonie", "romantique", "nadia event's decor", "cameroun"],
        "category": "22"
    },
    "51eb8b95-510e-462c-ab27-ba13ecb2fed5.MP4": {
        "title": "Nadia Event's Decor - Événements d'Entreprise Professionnels",
        "description": "Solutions de décoration complètes pour vos événements d'entreprise. Créez une ambiance professionnelle et moderne avec nos services de décoration corporate.\n\n🏢 Événements d'entreprise\n🎯 Décoration corporate\n🌟 Ambiance professionnelle\n\n📞 Contact: +237 699 275 786\n🌐 Site: nadiaevents.com\n\n#ÉvénementEntreprise #Corporate #NadiaEvents",
        "tags": ["événement entreprise", "corporate", "décoration", "professionnel", "nadia event's decor"],
        "category": "22"
    },
    "5898f350-4760-4794-974b-2920d8923f88.MP4": {
        "title": "Nadia Event's Decor - Anniversaires et Célébrations",
        "description": "Rendez chaque anniversaire mémorable avec nos décorations festives et créatives. De la décoration de table aux accessoires de fête, nous créons l'ambiance parfaite.\n\n🎉 Anniversaires\n🎈 Décoration festive\n🎊 Célébrations\n\n📞 Contact: +237 680 207 496\n🌐 Site: nadiaevents.com\n\n#Anniversaire #Fête #Décoration #NadiaEvents",
        "tags": ["anniversaire", "fête", "décoration", "célébration", "nadia event's decor"],
        "category": "22"
    },
    "9f0a5b14-42a0-4c3c-9fb1-c22550b85cc5.MP4": {
        "title": "Nadia Event's Decor - Baptêmes et Communions",
        "description": "Décoration sacrée et élégante pour les baptêmes et communions. Créez une atmosphère spirituelle et chaleureuse pour ces moments importants de la vie.\n\n⛪ Baptêmes\n✝️ Communions\n🕊️ Décoration sacrée\n\n📞 Contact: +237 657 759 510\n🌐 Site: nadiaevents.com\n\n#Baptême #Communion #DécorationSacrée #NadiaEvents",
        "tags": ["baptême", "communion", "décoration sacrée", "religieux", "nadia event's decor"],
        "category": "22"
    },
    "d39fd786-52da-4930-9736-0a6aa1dc758c.MP4": {
        "title": "Nadia Event's Decor - Éclairage et Ambiance",
        "description": "L'éclairage fait toute la différence ! Découvrez nos solutions d'éclairage créatif pour transformer n'importe quel espace en un lieu magique.\n\n💡 Éclairage créatif\n✨ Ambiance magique\n🌟 Effets lumineux\n\n📞 Contact: +237 699 275 786\n🌐 Site: nadiaevents.com\n\n#Éclairage #Ambiance #Décoration #NadiaEvents",
        "tags": ["éclairage", "ambiance", "décoration", "effets lumineux", "nadia event's decor"],
        "category": "22"
    },
    "e0d4e896-f834-4940-accd-69bcb29258b3.MP4": {
        "title": "Nadia Event's Decor - Décoration de Tables Élégantes",
        "description": "Nos décors de table élégants et sophistiqués transforment chaque repas en une expérience gastronomique exceptionnelle.\n\n🍽️ Décoration de table\n🌺 Centres de table\n🎀 Nappes et serviettes\n\n📞 Contact: +237 680 207 496\n🌐 Site: nadiaevents.com\n\n#DécorationTable #Élégance #NadiaEvents",
        "tags": ["décoration table", "centres de table", "élégance", "nadia event's decor"],
        "category": "22"
    },
    "e9ce7778-b538-46b7-bc8c-5035465bc0d4.MP4": {
        "title": "Nadia Event's Decor - Présentation de Nos Services",
        "description": "Découvrez l'ensemble de nos services de décoration événementielle. De la conception à la réalisation, nous créons des événements inoubliables.\n\n🎯 Services complets\n🎨 Conception personnalisée\n✨ Réalisation professionnelle\n\n📞 Contact: +237 657 759 510\n🌐 Site: nadiaevents.com\n📍 Yaoundé, Cameroun\n\n#Services #Décoration #NadiaEvents #Cameroun",
        "tags": ["services", "décoration", "événementiel", "nadia event's decor", "cameroun"],
        "category": "22"
    }
}

def get_authenticated_service():
    """Authentification avec l'API YouTube"""
    credentials = None
    
    # Vérifier si le fichier de tokens existe
    if os.path.exists('token.json'):
        credentials = json.load(open('token.json'))
    
    # Si pas de credentials valides, demander l'authentification
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
            credentials = flow.run_local_server(port=0)
        
        # Sauvegarder les credentials
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())
    
    return build(API_NAME, API_VERSION, credentials=credentials)

def upload_video(youtube, file_path, metadata):
    """Upload une vidéo vers YouTube"""
    try:
        print(f"📤 Upload de {os.path.basename(file_path)}...")
        
        # Préparer les métadonnées
        body = {
            'snippet': {
                'title': metadata['title'],
                'description': metadata['description'],
                'tags': metadata['tags'],
                'categoryId': metadata['category']
            },
            'status': {
                'privacyStatus': 'public',
                'selfDeclaredMadeForKids': False
            }
        }
        
        # Créer l'objet MediaFileUpload
        media = MediaFileUpload(file_path, chunksize=-1, resumable=True)
        
        # Upload la vidéo
        request = youtube.videos().insert(
            part=','.join(body.keys()),
            body=body,
            media_body=media
        )
        
        # Suivre la progression
        response = None
        while response is None:
            status, response = request.next_chunk()
            if status:
                print(f"   Progression: {int(status.progress() * 100)}%")
        
        print(f"✅ Vidéo uploadée avec succès! ID: {response['id']}")
        print(f"🔗 Lien: https://www.youtube.com/watch?v={response['id']}")
        return response['id']
        
    except HttpError as e:
        print(f"❌ Erreur lors de l'upload: {e}")
        return None

def main():
    """Fonction principale"""
    print("🎬 Upload des vidéos Nadia Event's Decor vers YouTube")
    print("=" * 60)
    
    # Vérifier si le fichier client_secrets.json existe
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"❌ Fichier {CLIENT_SECRETS_FILE} manquant!")
        print("📝 Veuillez télécharger le fichier client_secrets.json depuis Google Cloud Console")
        print("🔗 https://console.cloud.google.com/apis/credentials")
        return
    
    # Chemin vers les vidéos
    videos_dir = Path("../assets/images")
    
    if not videos_dir.exists():
        print(f"❌ Dossier {videos_dir} introuvable!")
        return
    
    # Authentification
    try:
        youtube = get_authenticated_service()
        print("✅ Authentification réussie!")
    except Exception as e:
        print(f"❌ Erreur d'authentification: {e}")
        return
    
    # Upload des vidéos
    uploaded_videos = []
    
    for filename, metadata in VIDEO_METADATA.items():
        file_path = videos_dir / filename
        
        if file_path.exists():
            video_id = upload_video(youtube, str(file_path), metadata)
            if video_id:
                uploaded_videos.append({
                    'filename': filename,
                    'video_id': video_id,
                    'title': metadata['title'],
                    'url': f"https://www.youtube.com/watch?v={video_id}"
                })
            time.sleep(2)  # Pause entre les uploads
        else:
            print(f"⚠️  Fichier {filename} introuvable")
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES UPLOADS")
    print("=" * 60)
    
    if uploaded_videos:
        print(f"✅ {len(uploaded_videos)} vidéos uploadées avec succès!")
        print("\n📋 Liste des vidéos:")
        for video in uploaded_videos:
            print(f"   • {video['title']}")
            print(f"     🔗 {video['url']}")
            print()
        
        # Sauvegarder le rapport
        with open('upload_report.json', 'w', encoding='utf-8') as f:
            json.dump(uploaded_videos, f, indent=2, ensure_ascii=False)
        print("📄 Rapport sauvegardé dans upload_report.json")
    else:
        print("❌ Aucune vidéo n'a été uploadée")

if __name__ == '__main__':
    main() 