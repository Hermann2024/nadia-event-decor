# 🚀 Guide de Déploiement - Nadia Event's Decor

## 📋 Prérequis

### Backend (Java/Spring Boot)
- **Java 11** ou supérieur
- **Maven 3.6** ou supérieur
- **MySQL 8.0** (optionnel, H2 en mémoire par défaut)

### Frontend (React)
- **Node.js 16** ou supérieur
- **npm 8** ou supérieur

## 🏗️ Architecture

```
nadia-events-decor/
├── eureka-server/          # Service Discovery (Port 8761)
├── gateway-service/        # API Gateway (Port 8080)
├── product-service/        # Gestion des produits (Port 8081)
├── frontend/              # Application React (Port 3000)
├── assets/                # Images et ressources
└── start-backend.sh       # Script de démarrage backend
```

## 🚀 Démarrage Rapide

### 1. Démarrer les Services Backend

```bash
# Donner les permissions d'exécution
chmod +x start-backend.sh

# Démarrer tous les services backend
./start-backend.sh
```

**Services démarrés :**
- Eureka Server: http://localhost:8761
- API Gateway: http://localhost:8080
- Product Service: http://localhost:8081

### 2. Démarrer le Frontend

```bash
# Dans un nouveau terminal
chmod +x start-frontend.sh
./start-frontend.sh
```

**Frontend accessible :**
- Site Web: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## 📱 Fonctionnalités

### ✅ Implémentées
- **Design Magnifique** : Vert citron et vert avec flocons de neige animés
- **Effets Sonores** : Sons d'interaction (clics, survols)
- **Page d'Accueil** : Hero section, services, galerie, réseaux sociaux
- **Catalogue Produits** : Filtrage, recherche, panier
- **Page À Propos** : Histoire, valeurs, équipe, statistiques
- **Page Contact** : Formulaire de devis, informations de contact
- **Administration** : Tableau de bord, gestion des produits
- **Responsive Design** : Compatible mobile et desktop
- **Animations** : Framer Motion pour les transitions
- **Microservices** : Architecture Spring Boot + Eureka

### 🔄 En Cours de Développement
- Service de paiement (liens de paiement)
- Service de messagerie
- Service d'avis clients
- Service comptable
- Service de devis/factures
- Service utilisateurs
- Intégration YouTube, Facebook, TikTok, Snapchat

## 🎨 Design System

### Couleurs
- **Vert Citron** : #32CD32
- **Vert Forêt** : #228B22
- **Vert Clair** : #90EE90
- **Vert Foncé** : #006400
- **Vert Très Clair** : #F0FFF0

### Typographie
- **Titres** : Playfair Display (Serif)
- **Corps** : Poppins (Sans-serif)

### Effets Visuels
- **Flocons de Neige** : Animation CSS personnalisée
- **Gradients** : Dégradés verts élégants
- **Ombres** : Ombres douces avec couleur verte
- **Transitions** : Animations fluides 0.3s

## 🔧 Configuration

### Base de Données
```yaml
# application.yml (Product Service)
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/nadia_events_decor
    username: root
    password: root
```

### Eureka Server
```yaml
# application.yml (Eureka)
server:
  port: 8761
spring:
  security:
    user:
      name: admin
      password: admin123
```

### API Gateway
```yaml
# application.yml (Gateway)
server:
  port: 8080
spring:
  cloud:
    gateway:
      routes:
        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**
```

## 📸 Images Importées

Les images de décoration ont été importées depuis le dossier `nadia-pictures` :
- **180+ images** de décoration événementielle
- **Vidéos** de démonstration
- **Organisation** par catégories (décorations, événements, etc.)

## 🌐 Réseaux Sociaux

### Liens Configurés
- **Facebook** : https://facebook.com/nadiaeventsdecor
- **Instagram** : https://instagram.com/nadiaeventsdecor
- **YouTube** : https://youtube.com/nadiaeventsdecor
- **TikTok** : https://tiktok.com/@nadiaeventsdecor

## 🛠️ Développement

### Structure des Composants
```
frontend/src/
├── components/     # Composants réutilisables
├── pages/         # Pages principales
├── services/      # Services API
├── assets/        # Ressources statiques
└── styles/        # Styles globaux
```

### API Endpoints
```
GET    /api/products           # Liste des produits
GET    /api/products/{id}      # Détail d'un produit
POST   /api/products           # Créer un produit
PUT    /api/products/{id}      # Modifier un produit
DELETE /api/products/{id}      # Supprimer un produit
```

## 🚀 Déploiement en Production

### Backend (Docker)
```dockerfile
FROM openjdk:11-jre-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend (Build)
```bash
cd frontend
npm run build
# Déployer le dossier build/
```

## 📞 Support

**Fondé par :** Nadine Kechiamen Nganou  
**Email :** contact@nadiaeventsdecor.com  
**Téléphone :** +237 XXX XXX XXX

---

*Nadia Event's Decor - Créons ensemble vos événements de rêve* ✨ 