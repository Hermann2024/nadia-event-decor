# Système de Gestion des Devis et Factures - Nadia Event's Decor

## Vue d'ensemble

Ce système complet de gestion des devis et factures a été implémenté pour automatiser et optimiser le processus de gestion des demandes clients, de la création des devis jusqu'au suivi des paiements.

## Fonctionnalités principales

### 1. Stockage en base de données
- **Demandes de devis** : Stockage complet avec suivi de statut et assignation
- **Devis** : Gestion des devis avec validité et suivi
- **Factures** : Création et suivi des factures avec échéances
- **Notifications** : Système de notifications en temps réel
- **Transactions comptables** : Suivi financier complet

### 2. Interface admin
- **Dashboard** : Vue d'ensemble avec statistiques
- **Gestion des demandes** : Interface complète pour traiter les demandes
- **Assignation** : Système d'assignation aux membres du staff
- **Suivi de statut** : Workflow complet de traitement
- **Notifications** : Centre de notifications en temps réel

### 3. Envoi d'emails
- **Templates HTML** : Emails professionnels avec Thymeleaf
- **Confirmation automatique** : Envoi de confirmation aux clients
- **Notifications équipe** : Alertes automatiques pour l'équipe
- **Rappels de paiement** : Système de rappels automatiques

### 4. Notifications en temps réel
- **WebSocket** : Notifications instantanées
- **Centre de notifications** : Interface utilisateur pour les notifications
- **Différents types** : Notifications pour devis, factures, assignations
- **Marquage lu/non lu** : Gestion du statut de lecture

### 5. Système de suivi
- **Workflow complet** : NEW → ASSIGNED → IN_PROGRESS → QUOTE_PREPARED → SENT → ACCEPTED/REJECTED
- **Priorités** : LOW, MEDIUM, HIGH, URGENT
- **Assignation** : Attribution aux membres du staff
- **Dates d'échéance** : Suivi des délais
- **Historique** : Traçabilité complète

## Architecture technique

### Backend (Spring Boot)

#### Modèles
- `QuoteRequest` : Demandes de devis avec statut et assignation
- `Quote` : Devis avec validité et suivi
- `Invoice` : Factures avec échéances
- `Notification` : Notifications en temps réel
- `Staff` : Membres de l'équipe

#### Services
- `QuoteRequestService` : Gestion des demandes de devis
- `NotificationService` : Notifications et WebSocket
- `EmailService` : Envoi d'emails avec templates
- `QuoteService` : Gestion des devis
- `InvoiceService` : Gestion des factures

#### Contrôleurs
- `QuoteRequestController` : API pour les demandes de devis
- `NotificationController` : API pour les notifications
- `ContactController` : Endpoints publics pour les demandes
- `QuoteController` : Gestion des devis
- `InvoiceController` : Gestion des factures

#### Configuration
- `WebSocketConfig` : Configuration WebSocket pour les notifications
- Templates Thymeleaf pour les emails
- Configuration email avec JavaMail

### Frontend (React)

#### Composants
- `QuoteRequestManagement` : Interface de gestion des demandes
- `NotificationCenter` : Centre de notifications en temps réel
- `AdminDashboard` : Dashboard avec statistiques
- `QuoteManagement` : Gestion des devis
- `InvoiceManagement` : Gestion des factures

#### Fonctionnalités
- Interface responsive et moderne
- Notifications en temps réel via WebSocket
- Filtres et recherche avancés
- Modales pour les actions
- Statistiques en temps réel

## Installation et configuration

### Prérequis
- Java 11+
- Node.js 14+
- Maven
- Base de données H2 (ou autre)

### Configuration email
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  email:
    enabled: ${EMAIL_ENABLED:false}
    from: ${EMAIL_FROM:nadia@events-decor.com}
```

### Variables d'environnement
```bash
# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
EMAIL_ENABLED=true
EMAIL_FROM=nadia@events-decor.com

# Admin
ADMIN_EMAIL=admin@nadia-events-decor.com
```

## Utilisation

### 1. Demande de devis (Client)
```javascript
// Frontend - Formulaire de demande
const submitQuoteRequest = async (data) => {
  const response = await fetch('/api/contact/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. Gestion des demandes (Admin)
```javascript
// Récupération des demandes
const requests = await fetch('/api/admin/quote-requests');

// Assignation
await fetch(`/api/admin/quote-requests/${requestId}/assign/${staffId}`, {
  method: 'PUT'
});

// Mise à jour du statut
await fetch(`/api/admin/quote-requests/${requestId}/status/${status}`, {
  method: 'PUT'
});
```

### 3. Notifications
```javascript
// Connexion WebSocket
const ws = new WebSocket('ws://localhost:8082/ws');

// Écoute des notifications
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Traitement de la notification
};
```

## Workflow typique

### 1. Réception d'une demande
1. Client soumet une demande via le formulaire
2. Système crée un `QuoteRequest` avec statut "NEW"
3. Email de confirmation envoyé au client
4. Notifications envoyées à l'équipe admin

### 2. Traitement de la demande
1. Admin consulte les nouvelles demandes
2. Assignation à un membre du staff
3. Statut changé à "ASSIGNED"
4. Notification envoyée au membre assigné

### 3. Préparation du devis
1. Membre du staff traite la demande
2. Statut changé à "IN_PROGRESS"
3. Création du devis
4. Statut changé à "QUOTE_PREPARED"

### 4. Envoi du devis
1. Devis envoyé au client
2. Statut changé à "SENT"
3. Email avec template HTML envoyé
4. Suivi de la réponse client

### 5. Suivi du paiement
1. Si accepté, création de facture
2. Envoi de la facture au client
3. Suivi des échéances
4. Rappels automatiques si retard

## API Endpoints

### Demandes de devis
- `POST /api/contact/quote` - Soumettre une demande
- `GET /api/admin/quote-requests` - Liste des demandes
- `GET /api/admin/quote-requests/{id}` - Détails d'une demande
- `PUT /api/admin/quote-requests/{id}/assign/{staffId}` - Assigner
- `PUT /api/admin/quote-requests/{id}/status/{status}` - Changer statut
- `GET /api/admin/quote-requests/stats` - Statistiques

### Notifications
- `GET /api/admin/notifications/user/{userId}` - Notifications utilisateur
- `GET /api/admin/notifications/user/{userId}/unread` - Non lues
- `PUT /api/admin/notifications/{id}/read` - Marquer comme lu
- `PUT /api/admin/notifications/user/{userId}/read-all` - Tout marquer lu

### WebSocket
- `ws://localhost:8082/ws` - Connexion WebSocket
- `/user/{userId}/queue/notifications` - Notifications privées
- `/topic/notifications` - Notifications publiques

## Sécurité

- Validation des données côté serveur
- Authentification pour les endpoints admin
- CORS configuré pour le développement
- Validation des emails et formats

## Monitoring et logs

- Logs détaillés pour le suivi
- Métriques de performance
- Suivi des erreurs
- Historique des actions

## Évolutions futures

1. **Intégration paiement** : Stripe, PayPal
2. **Signature électronique** : Devis et factures
3. **Rapports avancés** : Analytics et KPIs
4. **Mobile app** : Application mobile
5. **IA/ML** : Suggestions de prix, détection de fraude
6. **Intégration CRM** : HubSpot, Salesforce
7. **Automatisation** : Workflows automatisés
8. **Multi-langues** : Support international

## Support

Pour toute question ou problème :
- Email : admin@nadia-events-decor.com
- Documentation technique : Voir les commentaires dans le code
- Issues : Utiliser le système de tickets du projet 