# 🚀 Démarrage Rapide - Upload YouTube

## 📋 Prérequis

- ✅ Python 3.7+ installé
- ✅ Compte Google avec accès à YouTube
- ✅ Vidéos MP4 dans le dossier `assets/images/`

## 🔧 Configuration en 5 étapes

### 1. Lancer le script principal
```bash
cd scripts
./upload-all-videos.sh
```

### 2. Configuration YouTube API
Le script vous guidera automatiquement. Voici les étapes :

1. **Google Cloud Console** : https://console.cloud.google.com/
2. **Créer un projet** (ou sélectionner un existant)
3. **Activer l'API YouTube Data v3** : https://console.cloud.google.com/apis/library/youtube.googleapis.com
4. **Créer des identifiants OAuth 2.0** :
   - Type : Application de bureau
   - Nom : Nadia Events Decor Upload
5. **Télécharger** `client_secrets.json`
6. **Placer** le fichier dans le dossier `scripts/`

### 3. Tester la configuration
Dans le menu, choisissez **Option 1** pour tester.

### 4. Upload des vidéos
Choisissez **Option 4** pour uploader ET créer la playlist.

### 5. Vérifier les résultats
- 📺 Vidéos disponibles sur votre chaîne YouTube
- 📋 Playlist "Nadia Events Decor - Décoration Événementielle"
- 📄 Rapports sauvegardés dans `upload_report.json` et `playlist_info.json`

## 🎯 Vidéos Configurées

Le système uploadera automatiquement **8 vidéos** avec métadonnées optimisées :

1. **Décoration de Mariage Élégante**
2. **Arches de Mariage Spectaculaires**
3. **Événements d'Entreprise Professionnels**
4. **Anniversaires et Célébrations**
5. **Baptêmes et Communions**
6. **Éclairage et Ambiance**
7. **Décoration de Tables Élégantes**
8. **Présentation de Nos Services**

## 📞 Contacts Intégrés

Chaque vidéo inclut automatiquement :
- 📞 +237 680 207 496
- 📞 +237 657 759 510
- 📞 +237 699 275 786
- 🌐 nadiaevents.com
- 📍 Yaoundé, Cameroun

## 🔗 Liens Utiles

- **Google Cloud Console** : https://console.cloud.google.com/
- **API YouTube** : https://console.cloud.google.com/apis/library/youtube.googleapis.com
- **Identifiants** : https://console.cloud.google.com/apis/credentials
- **Documentation complète** : README.md

## ⚠️ Notes Importantes

- Les vidéos sont uploadées en mode **public**
- La playlist est créée en mode **public**
- L'authentification OAuth 2.0 est sécurisée
- Les tokens sont stockés localement
- Le système gère automatiquement les erreurs

## 🆘 Support

En cas de problème :
1. Vérifiez la configuration avec l'option de test
2. Consultez les logs d'erreur
3. Vérifiez que `client_secrets.json` est valide
4. Assurez-vous que les vidéos existent dans `assets/images/` 