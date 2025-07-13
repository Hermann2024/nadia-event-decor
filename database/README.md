# Base de données - Nadia Events Decor

## Configuration

La base de données utilise **MySQL 8.0+** avec les paramètres suivants :

- **Host**: localhost
- **Port**: 3306
- **Database**: nadia_events_decor
- **Username**: root
- **Password**: root

## Structure des tables

### 1. Products (Produits)
```sql
- id: Identifiant unique
- name: Nom du produit
- description: Description détaillée
- price: Prix de location
- category: Catégorie (Tables, Arches, Éclairage, etc.)
- image_url: URL de l'image
- available: Disponibilité
- created_at/updated_at: Timestamps
```

### 2. Users (Utilisateurs)
```sql
- id: Identifiant unique
- username: Nom d'utilisateur unique
- email: Email unique
- password: Mot de passe hashé
- first_name/last_name: Prénom et nom
- phone: Téléphone
- role: Rôle (ADMIN/USER)
- created_at/updated_at: Timestamps
```

### 3. Quotes (Devis)
```sql
- id: Identifiant unique
- user_id: Référence vers l'utilisateur
- total_amount: Montant total
- status: Statut (PENDING/APPROVED/REJECTED/PAID)
- event_date: Date de l'événement
- event_type: Type d'événement
- notes: Notes additionnelles
- created_at/updated_at: Timestamps
```

### 4. Quote_Items (Éléments de devis)
```sql
- id: Identifiant unique
- quote_id: Référence vers le devis
- product_id: Référence vers le produit
- quantity: Quantité
- unit_price: Prix unitaire
- total_price: Prix total
```

### 5. Payments (Paiements)
```sql
- id: Identifiant unique
- quote_id: Référence vers le devis
- amount: Montant payé
- payment_method: Méthode de paiement
- payment_link: Lien de paiement
- status: Statut (PENDING/COMPLETED/FAILED)
- transaction_id: ID de transaction
- created_at/updated_at: Timestamps
```

### 6. Messages (Messages de contact)
```sql
- id: Identifiant unique
- user_id: Référence vers l'utilisateur (optionnel)
- subject: Sujet du message
- message: Contenu du message
- email: Email de contact
- phone: Téléphone de contact
- status: Statut (NEW/READ/REPLIED)
- created_at: Timestamp
```

### 7. Reviews (Avis clients)
```sql
- id: Identifiant unique
- user_id: Référence vers l'utilisateur
- product_id: Référence vers le produit
- rating: Note (1-5)
- comment: Commentaire
- created_at: Timestamp
```

### 8. Announcements (Annonces)
```sql
- id: Identifiant unique
- title: Titre de l'annonce
- content: Contenu de l'annonce
- active: Actif ou non
- created_at/updated_at: Timestamps
```

## Initialisation

Pour initialiser la base de données :

```bash
# Rendre le script exécutable
chmod +x database/init-database.sh

# Exécuter l'initialisation
./database/init-database.sh
```

## Données de test

Le script d'initialisation crée automatiquement :

- **5 produits** de décoration avec des images
- **1 compte admin** (admin/admin123)
- **1 annonce** de bienvenue

## Configuration des services

Chaque service Spring Boot utilise la configuration dans `application.yml` :

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/nadia_events_decor
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
```

## Sauvegarde et restauration

### Sauvegarde
```bash
mysqldump -u root -proot nadia_events_decor > backup.sql
```

### Restauration
```bash
mysql -u root -proot nadia_events_decor < backup.sql
``` 