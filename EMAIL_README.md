# 📧 Système d'Envoi d'Email - Nadia Events Decor

## Vue d'ensemble

Le système d'envoi d'email de Nadia Events Decor permet aux clients d'envoyer des messages de contact et des demandes de devis directement depuis le site web. Le système génère automatiquement des emails de notification pour l'équipe et des emails de confirmation pour les clients.

## 🚀 Fonctionnalités

### 1. **Message de Contact**
- Formulaire simple pour les questions générales
- Champs : nom, email, téléphone, sujet, message
- Email de notification envoyé à l'équipe
- Email de confirmation envoyé au client

### 2. **Demande de Devis**
- Formulaire détaillé pour les demandes de devis
- Champs supplémentaires :
  - Type d'événement (Mariage, Anniversaire, etc.)
  - Date de l'événement
  - Lieu de l'événement
  - Nombre d'invités
  - Budget estimé
  - Description du projet
  - Exigences supplémentaires
- Email de notification détaillé pour l'équipe
- Email de confirmation avec récapitulatif pour le client

## 🔧 Configuration

### Mode Développement (Actuel)
En mode développement, les emails sont simulés et affichés dans la console du serveur :
```yaml
spring:
  profiles:
    active: dev
```

### Mode Production
Pour activer l'envoi réel d'emails, configurez les paramètres SMTP dans `application.yml` :
```yaml
spring:
  profiles:
    active: prod
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
```

## 📋 API Endpoints

### 1. Envoi de Message de Contact
```
POST /api/contact/send
Content-Type: application/json

{
  "name": "Nom du client",
  "email": "email@example.com",
  "phone": "+237 123 456 789",
  "subject": "Sujet du message",
  "message": "Contenu du message"
}
```

### 2. Demande de Devis
```
POST /api/contact/quote
Content-Type: application/json

{
  "name": "Nom du client",
  "email": "email@example.com",
  "phone": "+237 123 456 789",
  "eventType": "Mariage",
  "eventDate": "2024-12-25",
  "eventLocation": "Yaoundé, Cameroun",
  "guestCount": 200,
  "budget": "500 000 - 1 000 000 FCFA",
  "message": "Description du projet",
  "additionalRequirements": "Exigences supplémentaires"
}
```

## 📧 Templates d'Email

### 1. **contact-notification.html**
Email envoyé à l'équipe pour les messages de contact
- Informations du client
- Détails du message
- Actions recommandées

### 2. **quote-request.html**
Email envoyé à l'équipe pour les demandes de devis
- Informations complètes du projet
- Détails de l'événement
- Budget et exigences

### 3. **contact-confirmation.html**
Email de confirmation pour les messages de contact
- Accusé de réception
- Coordonnées de l'entreprise
- Prochaines étapes

### 4. **quote-confirmation.html**
Email de confirmation pour les demandes de devis
- Récapitulatif de la demande
- Timeline des prochaines étapes
- Coordonnées de l'entreprise

## 🧪 Tests

### Test via API
```bash
# Test message de contact
curl -X POST http://localhost:8082/api/contact/send \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+237123456789",
    "subject": "Test Contact",
    "message": "Ceci est un test"
  }'

# Test demande de devis
curl -X POST http://localhost:8082/api/contact/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Devis",
    "email": "devis@example.com",
    "phone": "+237123456789",
    "eventType": "Mariage",
    "eventDate": "2024-12-25",
    "eventLocation": "Yaoundé",
    "guestCount": 150,
    "budget": "500 000 - 1 000 000 FCFA",
    "message": "Description du projet"
  }'
```

### Test via Script
```bash
node test-email.js
```

### Test via Interface Web
1. Allez sur http://localhost:3000/contact
2. Utilisez les onglets "Message de Contact" ou "Demande de Devis"
3. Remplissez le formulaire et soumettez

## 📱 Interface Utilisateur

### Page de Contact
- **Onglet "Message de Contact"** : Formulaire simple pour les questions générales
- **Onglet "Demande de Devis"** : Formulaire détaillé pour les demandes de devis
- Design moderne avec validation en temps réel
- Messages de succès/erreur

### Champs du Formulaire de Devis
- **Informations personnelles** : nom, email, téléphone
- **Détails de l'événement** : type, date, lieu, nombre d'invités
- **Budget** : fourchettes prédéfinies
- **Description** : zone de texte libre
- **Exigences** : zone de texte libre pour les détails supplémentaires

## 🔒 Sécurité

- Validation des données côté client et serveur
- Protection contre les injections SQL
- Limitation de la taille des messages
- Validation des formats d'email et de téléphone

## 🚀 Déploiement

### Variables d'Environnement
```bash
# Pour la production
export MAIL_USERNAME=votre_email@gmail.com
export MAIL_PASSWORD=votre_mot_de_passe_app
export SPRING_PROFILES_ACTIVE=prod
```

### Configuration Gmail
1. Activez l'authentification à 2 facteurs
2. Générez un mot de passe d'application
3. Utilisez ce mot de passe dans la configuration

## 📊 Monitoring

### Logs
- Les emails simulés sont affichés dans la console du serveur
- En production, utilisez un service de monitoring d'email

### Métriques
- Nombre d'emails envoyés
- Taux de succès
- Temps de réponse

## 🛠️ Maintenance

### Mise à Jour des Templates
1. Modifiez les fichiers HTML dans `src/main/resources/templates/`
2. Redémarrez le service admin
3. Testez avec le script de test

### Ajout de Nouveaux Types d'Événements
1. Modifiez la liste dans `Contact.js`
2. Mettez à jour les templates si nécessaire
3. Testez les nouveaux types

## 📞 Support

Pour toute question ou problème :
- Vérifiez les logs du serveur admin
- Testez avec le script `test-email.js`
- Consultez la documentation des templates Thymeleaf 