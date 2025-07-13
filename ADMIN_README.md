# 🎉 Système d'Administration - Nadia Event's Decor

## 📋 Vue d'ensemble

Le système d'administration de Nadia Event's Decor comprend quatre modules principaux :

1. **📊 Tableau de bord** - Vue d'ensemble et statistiques
2. **💰 Gestion Comptable** - Transactions financières
3. **👥 Gestion du Personnel** - Employés et ressources humaines
4. **📄 Gestion des Factures** - Facturation clients
5. **📋 Gestion des Devis** - Devis et propositions

## 🚀 Démarrage rapide

### Option 1: Script automatique (Recommandé)
```bash
# Démarrer tous les services
./start-services.sh

# Arrêter tous les services
./stop-services.sh
```

### Option 2: Démarrage manuel
```bash
# 1. Eureka Server (Port 8761)
cd eureka-server && mvn spring-boot:run

# 2. Admin Service (Port 8082)
cd admin-service && mvn spring-boot:run

# 3. Product Service (Port 8081)
cd product-service && mvn spring-boot:run

# 4. Gateway Service (Port 8080)
cd gateway-service && mvn spring-boot:run

# 5. Frontend (Port 3000)
cd frontend && npm start
```

## 🌐 Accès aux interfaces

- **Frontend principal**: http://localhost:3000
- **Interface d'administration**: http://localhost:3000/admin
- **API Gateway**: http://localhost:8080
- **Serveur Eureka**: http://localhost:8761
- **Console H2 (Admin)**: http://localhost:8082/h2-console
- **Console H2 (Product)**: http://localhost:8081/h2-console

## 📊 Modules d'administration

### 1. Tableau de bord
- **Statistiques générales**: Chiffre d'affaires, nombre de clients, etc.
- **Graphiques**: Évolution des ventes, répartition par catégorie
- **Activité récente**: Dernières factures, devis, transactions
- **Alertes**: Factures en retard, devis expirés

### 2. Gestion Comptable
- **Transactions**: Enregistrement des entrées/sorties
- **Catégories**: Dépenses, revenus, investissements
- **Rapports**: Bilan, compte de résultat
- **Réconciliation**: Vérification des comptes

### 3. Gestion du Personnel
- **Employés**: Fiches complètes du personnel
- **Départements**: Organisation par service
- **Statuts**: Actif, inactif, congé, terminé
- **Informations**: Coordonnées, salaires, contrats

### 4. Gestion des Factures
- **Création**: Génération de factures
- **Statuts**: En attente, payée, en retard
- **Clients**: Informations client complètes
- **Événements**: Association facture-événement

### 5. Gestion des Devis
- **Propositions**: Création de devis
- **Validité**: Dates d'expiration
- **Statuts**: En attente, accepté, refusé
- **Conversion**: Transformation devis → facture

## 🔧 API Endpoints

### Admin Service (Port 8082)

#### Dashboard
- `GET /api/admin/dashboard/stats` - Statistiques générales
- `GET /api/admin/dashboard/recent` - Activité récente

#### Personnel
- `GET /api/admin/staff` - Liste du personnel
- `POST /api/admin/staff` - Ajouter un employé
- `PUT /api/admin/staff/{id}` - Modifier un employé
- `DELETE /api/admin/staff/{id}` - Supprimer un employé
- `GET /api/admin/staff/search?q={query}` - Recherche

#### Factures
- `GET /api/admin/invoices` - Liste des factures
- `POST /api/admin/invoices` - Créer une facture
- `PUT /api/admin/invoices/{id}/status` - Changer le statut
- `GET /api/admin/invoices/stats` - Statistiques factures

#### Devis
- `GET /api/admin/quotes` - Liste des devis
- `POST /api/admin/quotes` - Créer un devis
- `PUT /api/admin/quotes/{id}/status` - Changer le statut
- `GET /api/admin/quotes/stats` - Statistiques devis

#### Comptabilité
- `GET /api/admin/accounting/transactions` - Transactions
- `POST /api/admin/accounting/transactions` - Nouvelle transaction
- `GET /api/admin/accounting/stats` - Statistiques comptables

## 📊 Base de données

### Tables principales
- `staff` - Personnel
- `invoices` - Factures
- `invoice_items` - Éléments de facture
- `quotes` - Devis
- `quote_items` - Éléments de devis
- `accounting_transactions` - Transactions comptables
- `products` - Produits
- `posts` - Articles

### Données de test
Le système inclut des données de test pour :
- 5 employés (Nadine, Marie, Sarah, David, Claire)
- 10 produits de décoration
- 3 factures d'exemple
- 2 devis d'exemple
- 5 transactions comptables

## 🛠️ Développement

### Structure du projet
```
admin-service/
├── src/main/java/com/nadiaevents/admin/
│   ├── controller/     # Contrôleurs REST
│   ├── model/         # Entités JPA
│   ├── repository/    # Repositories Spring Data
│   └── service/       # Services métier
├── src/main/resources/
│   ├── schema.sql     # Création des tables
│   └── data.sql       # Données de test
```

### Technologies utilisées
- **Backend**: Spring Boot 2.7.14, Spring Data JPA, H2 Database
- **Frontend**: React, Material-UI
- **Architecture**: Microservices avec Eureka, Gateway
- **Base de données**: H2 (développement), MySQL (production)

## 🔍 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   lsof -ti:8080 | xargs kill -9
   ```

2. **Erreur de compilation**
   ```bash
   mvn clean install
   ```

3. **Base de données corrompue**
   ```bash
   rm -rf admin-service/target/
   mvn spring-boot:run
   ```

4. **Services ne se connectent pas**
   - Vérifier qu'Eureka est démarré
   - Vérifier les URLs dans application.yml

### Logs
Les logs sont disponibles dans le dossier `logs/` :
- `eureka.log` - Serveur de découverte
- `admin.log` - Service d'administration
- `product.log` - Service produit
- `gateway.log` - Passerelle API
- `frontend.log` - Interface utilisateur

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs dans le dossier `logs/`
2. Consulter la console H2 pour vérifier les données
3. Tester les endpoints API directement
4. Redémarrer les services si nécessaire

---

**Nadia Event's Decor** - Système d'administration complet pour la gestion événementielle 🎉 