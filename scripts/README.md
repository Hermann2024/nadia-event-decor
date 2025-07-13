# 🎬 Upload YouTube - Nadia Events Decor

Scripts automatisés pour uploader les vidéos de Nadia Events Decor vers YouTube avec métadonnées optimisées.

## 📋 Vidéos Configurées

Le système est configuré pour uploader **8 vidéos** avec des métadonnées personnalisées :

1. **Décoration de Mariage Élégante** - `1a3cfdf2-5bfe-490e-8943-e9fc11e47bcb.MP4`
2. **Arches de Mariage Spectaculaires** - `4d1805a2-c1d6-408f-b201-627b7fc9a1ca.MP4`
3. **Événements d'Entreprise Professionnels** - `51eb8b95-510e-462c-ab27-ba13ecb2fed5.MP4`
4. **Anniversaires et Célébrations** - `5898f350-4760-4794-974b-2920d8923f88.MP4`
5. **Baptêmes et Communions** - `9f0a5b14-42a0-4c3c-9fb1-c22550b85cc5.MP4`
6. **Éclairage et Ambiance** - `d39fd786-52da-4930-9736-0a6aa1dc758c.MP4`
7. **Décoration de Tables Élégantes** - `e0d4e896-f834-4940-accd-69bcb29258b3.MP4`
8. **Présentation de Nos Services** - `e9ce7778-b538-46b7-bc8c-5035465bc0d4.MP4`

## 🚀 Démarrage Rapide

### 1. Configuration Initiale

```bash
# Rendre les scripts exécutables
chmod +x *.sh

# Lancer le script principal
./upload-all-videos.sh
```

### 2. Configuration YouTube API

Le script vous guidera pour configurer l'API YouTube. Voici les étapes :

1. **Google Cloud Console** : https://console.cloud.google.com/
2. **Créer un projet** ou sélectionner un projet existant
3. **Activer l'API YouTube Data v3** : https://console.cloud.google.com/apis/library/youtube.googleapis.com
4. **Créer des identifiants OAuth 2.0** :
   - Type : Application de bureau
   - Nom : Nadia Events Decor Upload
5. **Télécharger** `client_secrets.json`
6. **Placer** le fichier dans le dossier `scripts/`

## 📁 Structure des Fichiers

```
scripts/
├── upload-all-videos.sh          # Script principal (menu interactif)
├── upload-videos.py              # Upload des vidéos individuelles
├── create-playlist.py            # Création de playlist
├── setup-youtube-upload.sh       # Configuration de l'environnement
├── requirements.txt              # Dépendances Python
├── client_secrets.json           # Identifiants YouTube API (à télécharger)
├── upload_report.json            # Rapport d'upload (généré)
├── playlist_info.json            # Informations playlist (généré)
└── token.json                    # Token d'authentification (généré)
```

## 🎯 Fonctionnalités

### Upload de Vidéos
- ✅ Upload automatique de 8 vidéos
- ✅ Métadonnées optimisées (titres, descriptions, tags)
- ✅ Contacts intégrés dans les descriptions
- ✅ Suivi de progression en temps réel
- ✅ Gestion des erreurs

### Création de Playlist
- ✅ Playlist publique "Nadia Events Decor - Décoration Événementielle"
- ✅ Description complète avec contacts
- ✅ Tags optimisés pour le référencement
- ✅ Ajout automatique de toutes les vidéos

### Métadonnées Optimisées
Chaque vidéo inclut :
- 📝 Titre descriptif et accrocheur
- 📄 Description détaillée avec contacts
- 🏷️ Tags pertinents pour le SEO
- 📞 Numéros de téléphone : +237 680 207 496, +237 657 759 510, +237 699 275 786
- 🌐 Site web : nadiaevents.com
- 📍 Localisation : Yaoundé, Cameroun

## 🔧 Utilisation

### Script Principal (Recommandé)
```bash
./upload-all-videos.sh
```

### Scripts Individuels
```bash
# Configuration initiale
./setup-youtube-upload.sh

# Upload des vidéos
python3 upload-videos.py

# Création de playlist
python3 create-playlist.py
```

## 📊 Rapports

Le système génère automatiquement :

### upload_report.json
```json
[
  {
    "filename": "1a3cfdf2-5bfe-490e-8943-e9fc11e47bcb.MP4",
    "video_id": "ABC123xyz",
    "title": "Nadia Events Decor - Décoration de Mariage Élégante",
    "url": "https://www.youtube.com/watch?v=ABC123xyz"
  }
]
```

### playlist_info.json
```json
{
  "playlist_id": "PL123456789",
  "playlist_title": "Nadia Events Decor - Décoration Événementielle",
  "playlist_url": "https://www.youtube.com/playlist?list=PL123456789",
  "videos_count": 8,
  "videos": [...]
}
```

## 🔒 Sécurité

- ✅ Authentification OAuth 2.0 sécurisée
- ✅ Tokens stockés localement
- ✅ Pas de clés API exposées dans le code
- ✅ Gestion automatique du renouvellement des tokens

## 🛠️ Dépendances

- Python 3.7+
- google-auth
- google-auth-oauthlib
- google-auth-httplib2
- google-api-python-client

## 📞 Support

Pour toute question ou problème :
- 📧 Email : contact@nadiaevents.com
- 📞 Téléphone : +237 680 207 496
- 🌐 Site : nadiaevents.com

## 📝 Notes

- Les vidéos sont uploadées en mode **public**
- La playlist est créée en mode **public**
- Les métadonnées incluent les contacts de Nadia Events Decor
- Le système gère automatiquement les erreurs et les reprises
- Les rapports sont sauvegardés pour référence future 