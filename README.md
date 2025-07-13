# Nadia Events Decor 🎉

Site de location de décoration et événementiel fondé par **Nadine Kechiamen Nganou**

## 🚀 Démarrage rapide

### Prérequis
- Java 11+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+

### 1. Initialiser la base de données
```bash
# Installer MySQL (si pas déjà fait)
brew install mysql  # macOS
sudo apt-get install mysql-server  # Ubuntu

# Démarrer MySQL
brew services start mysql  # macOS
sudo systemctl start mysql  # Ubuntu

# Initialiser la base de données
chmod +x database/init-database.sh
./database/init-database.sh
```

### 2. Démarrer les services backend
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### 3. Démarrer le frontend
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

## 📱 Accès aux services

- **Frontend**: http://localhost:3000
- **Eureka Server**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Product Service**: http://localhost:8081
- **Admin Service**: http://localhost:8082

## 🎬 Upload YouTube Automatisé

Système d'upload automatique des vidéos vers YouTube avec métadonnées optimisées.

### 🚀 Démarrage rapide YouTube
```bash
cd scripts
./upload-all-videos.sh
```

### 📋 Vidéos configurées (8 vidéos)
1. **Décoration de Mariage Élégante**
2. **Arches de Mariage Spectaculaires**
3. **Événements d'Entreprise Professionnels**
4. **Anniversaires et Célébrations**
5. **Baptêmes et Communions**
6. **Éclairage et Ambiance**
7. **Décoration de Tables Élégantes**
8. **Présentation de Nos Services**

### 🔧 Configuration YouTube API
1. **Google Cloud Console** : https://console.cloud.google.com/
2. **Activer l'API YouTube Data v3**
3. **Créer des identifiants OAuth 2.0** (Application de bureau)
4. **Télécharger** `client_secrets.json`
5. **Placer** le fichier dans `scripts/`

### 📞 Contacts intégrés automatiquement
- +237 680 207 496
- +237 657 759 510
- +237 699 275 786
- nadiaevents.com
- Yaoundé, Cameroun

**📖 Documentation complète** : `scripts/README.md`
**🚀 Guide rapide** : `scripts/QUICK_START.md`

## 🗄️ Base de données

La base de données MySQL contient 8 tables principales :
- `products` - Produits de décoration
- `users` - Utilisateurs du système
- `quotes` - Devis clients
- `quote_items` - Éléments des devis
- `payments` - Paiements
- `messages` - Messages de contact
- `reviews` - Avis clients
- `announcements` - Annonces

Voir `database/README.md` pour plus de détails.

## 🎨 Fonctionnalités

### ✅ Implémentées
- **Design moderne** avec thème vert citron/vert
- **Animations de flocons** et effets sonores
- **Catalogue de produits** avec filtres et recherche
- **Système de panier** et gestion des devis
- **Interface admin** pour gestion des produits
- **Formulaire de contact** avec validation
- **Intégration YouTube** et réseaux sociaux
- **Architecture microservices** avec Spring Boot
- **Base de données MySQL** complète
- **Upload YouTube automatisé** avec métadonnées optimisées

### 🚧 En développement
- Service de paiement (liens de paiement)
- Service de messagerie
- Service d'avis clients
- Service de comptabilité
- Service utilisateur (authentification)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Eureka Server  │
│   (React)       │◄──►│   (Spring)      │◄──►│   (Spring)      │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 8761    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Product Service │
                       │   (Spring)      │
                       │   Port: 8081    │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MySQL DB      │
                       │   Port: 3306    │
                       └─────────────────┘
```

## 🎯 Services

### Eureka Server
- Service de découverte pour les microservices
- Interface web pour surveiller les services

### Gateway Service
- Point d'entrée unique pour toutes les API
- Routage et filtrage des requêtes
- Load balancing

### Product Service
- Gestion des produits de décoration
- CRUD complet avec base de données
- API REST pour le frontend

### Admin Service
- Nouvelles fonctionnalités
  - Gestion du personnel
  - Gestion des factures
  - Gestion des posts/annonces

## 🎨 Design System

### Couleurs
- **Vert citron**: #90EE90
- **Vert**: #228B22
- **Blanc**: #FFFFFF
- **Gris foncé**: #333333

### Animations
- Flocons de neige animés
- Effets de transition fluides
- Sons d'interface utilisateur

## 📸 Images importées

Plus de 180 images de décoration ont été importées dans `assets/images/decorations/` :
- Décors de table
- Arches de mariage
- Éclairage décoratif
- Ballons et drapeaux
- Accessoires d'événementiel

## 🎬 Vidéos disponibles

8 vidéos MP4 dans `assets/images/` prêtes pour l'upload YouTube :
- Décorations de mariage
- Événements d'entreprise
- Célébrations et anniversaires
- Baptêmes et communions
- Éclairage et ambiance

## 🔗 Réseaux sociaux

- **Facebook**: [Nadia Events Decor](https://facebook.com/nadiaevents)
- **TikTok**: [@nadiaevents](https://tiktok.com/@nadiaevents)
- **Snapchat**: [nadiaevents](https://snapchat.com/add/nadiaevents)
- **YouTube**: [Nadia Events Decor](https://youtube.com/@nadiaevents)

## 🛠️ Développement

### Structure du projet
```
nadia-events-decor/
├── eureka-server/          # Service de découverte
├── gateway-service/        # API Gateway
├── product-service/        # Service produits
├── admin-service/          # Gestion administrative
├── frontend/              # Application React
├── database/              # Scripts de base de données
├── scripts/               # Scripts d'upload YouTube
└── assets/                # Images et vidéos
    └── images/
        ├── decorations/   # Images de décoration
        └── *.MP4         # Vidéos pour YouTube
```

### API Endpoints

#### Product Service (Port 8081)
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

#### Admin Service
- **Staff**: `/api/admin/staff/*`
- **Invoices**: `/api/admin/invoices/*`
- **Posts**: `/api/admin/posts/*`

## 🚀 Déploiement

Voir `DEPLOYMENT.md` pour les instructions de déploiement en production.

## 📞 Contact

**Nadine Kechiamen Nganou** - Fondatrice
- **Téléphone**: +237 680 207 496
- **Téléphone**: +237 657 759 510  
- **Téléphone**: +237 699 275 786
- **Email**: contact@nadiaevents.com
- **Adresse**: Yaoundé, Cameroun

---

*Nadia Events Decor - Créons ensemble vos plus beaux moments* ✨ 