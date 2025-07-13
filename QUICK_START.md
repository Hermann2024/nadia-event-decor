# 🚀 Guide de Démarrage Rapide - Nadia Event's Decor

## ❌ Erreurs Courantes et Solutions

### **Erreur "Failed to fetch"**
Cette erreur indique que le frontend ne peut pas communiquer avec les services backend.

**Causes possibles :**
1. Services non démarrés
2. Problèmes de CORS
3. Erreurs de configuration Eureka
4. Base de données non initialisée

## 🔧 Solutions

### **1. Redémarrer tous les services proprement**

```bash
# Arrêter tous les services
./stop-services.sh

# Démarrer tous les services dans le bon ordre
./start-services.sh
```

### **2. Vérifier manuellement chaque service**

Si le script automatique ne fonctionne pas, démarrez manuellement :

```bash
# 1. Eureka Server (port 8761)
cd eureka-server
mvn spring-boot:run

# 2. Admin Service (port 8082) - dans un nouveau terminal
cd admin-service
mvn spring-boot:run

# 3. Product Service (port 8081) - dans un nouveau terminal
cd product-service
mvn spring-boot:run

# 4. Gateway Service (port 8080) - dans un nouveau terminal
cd gateway-service
mvn spring-boot:run

# 5. Frontend (port 3000) - dans un nouveau terminal
cd frontend
npm start
```

### **3. Vérifier les URLs**

Assurez-vous que les services sont accessibles :

- **Eureka Server** : http://localhost:8761
- **Gateway** : http://localhost:8080
- **Admin Service** : http://localhost:8082
- **Product Service** : http://localhost:8081
- **Frontend** : http://localhost:3000
- **Admin Panel** : http://localhost:3000/admin

### **4. Vérifier les logs**

Consultez les logs dans le dossier `logs/` :

```bash
# Logs Eureka
tail -f logs/eureka.log

# Logs Admin Service
tail -f logs/admin.log

# Logs Gateway
tail -f logs/gateway.log

# Logs Product Service
tail -f logs/product.log

# Logs Frontend
tail -f logs/frontend.log
```

## 🐛 Problèmes Spécifiques

### **Erreur SQL "Table STAFF not found"**
- **Solution** : La configuration a été corrigée pour utiliser `ddl-auto: create-drop`
- **Redémarrage** : Redémarrez l'Admin Service

### **Erreur Gateway "Spring MVC found on classpath"**
- **Solution** : La configuration `web-application-type: reactive` est déjà en place
- **Redémarrage** : Redémarrez le Gateway Service

### **Erreur Eureka "401 Unauthorized"**
- **Solution** : L'authentification a été désactivée
- **Redémarrage** : Redémarrez tous les services

### **Erreur CORS**
- **Solution** : CORS est configuré dans le Gateway
- **Vérification** : Assurez-vous que le Gateway fonctionne sur le port 8080

## 📋 Checklist de Vérification

Avant d'accéder à l'admin panel :

- [ ] Eureka Server fonctionne sur http://localhost:8761
- [ ] Gateway Service fonctionne sur http://localhost:8080
- [ ] Admin Service fonctionne sur http://localhost:8082
- [ ] Product Service fonctionne sur http://localhost:8081
- [ ] Frontend fonctionne sur http://localhost:3000
- [ ] Tous les services sont enregistrés dans Eureka
- [ ] Pas d'erreurs dans les logs

## 🎯 Accès à l'Admin Panel

Une fois tous les services démarrés :

1. Ouvrez http://localhost:3000
2. Cliquez sur "Admin" dans la navigation
3. Ou accédez directement à http://localhost:3000/admin

## 🔄 Redémarrage Rapide

Si tu rencontres des problèmes :

```bash
# 1. Arrêter tout
./stop-services.sh

# 2. Attendre 5 secondes
sleep 5

# 3. Redémarrer tout
./start-services.sh

# 4. Attendre 2 minutes pour que tout soit prêt
```

## 📞 Support

Si les problèmes persistent :

1. Vérifiez que les ports 8761, 8080, 8081, 8082, 3000 sont libres
2. Vérifiez que Java 17 et Node.js sont installés
3. Vérifiez que Maven est installé
4. Consultez les logs pour plus de détails sur les erreurs 