#!/bin/bash

echo "=== Compilation du service Admin ==="

# Aller dans le répertoire du service admin
cd admin-service

# Nettoyer les anciens builds
echo "Nettoyage des anciens builds..."
mvn clean

# Résoudre les dépendances
echo "Résolution des dépendances..."
mvn dependency:resolve

# Compiler le projet
echo "Compilation du projet..."
mvn compile

# Vérifier le statut
if [ $? -eq 0 ]; then
    echo "✅ Compilation réussie !"
    echo "Le service admin est prêt à être démarré."
else
    echo "❌ Erreur de compilation"
    echo "Vérifiez les logs ci-dessus pour les détails."
fi 