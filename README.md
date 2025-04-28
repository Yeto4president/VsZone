# 🌱 VS Zone - Plateforme Écologique de Tournois en Ligne

  ![image](https://github.com/user-attachments/assets/1ff4d26f-ceab-49df-9573-4482ecb9ae53)


![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql)
![Eco-Design](https://img.shields.io/badge/Empreinte_Carbone-0.42gCO2/page-4BC0A0)

# 🎯 Présentation

VS Zone est une plateforme d'organisation de tournois en ligne avec une approche d'éco-conception.

![image](https://github.com/user-attachments/assets/0290d57c-3cce-44d3-9628-c8f8a8844b9b)


# 🛠 Installation

## Prérequis

Vérifier les versions

node -v  # Doit retourner >= 14

mysql --version  # Doit retourner >= 8

Configuration

Cloner le dépôt :

git clone https://github.com/votre-repo/vs-zone.git

cd vs-zone

Initialiser la base de données :

mysql -u root -p tournoi_db < database/tournoi_db.sql

Configurer les variables d'environnement :


## Créer un fichier .env
echo "DB_HOST=localhost" > .env

echo "DB_USER=votre_user" >> .env

echo "DB_PASS=votre_mdp" >> .env

echo "DB_NAME=tournoi_db" >> .env

## Installer les dépendances :

npm install

## Démarrer le serveur :

node server.js

# 📂 Structure des Fichiers
Dossier /css :

accounte.css : Styles pour la page de connexion/inscription.

accueil.css : Styles pour la page d'accueil.

regle.css : Styles pour la page des règles.

selectionner-theme.css : Styles pour la page de sélection de thème.

tournoi.css : Styles pour la page de gestion des tournois.

users.css : Styles pour la page de gestion des utilisateurs.

Dossier /html :

accounte.html : Page principale pour la connexion et l'inscription.

accueil.html : Page d'accueil pour les utilisateurs, avec accès aux contests.

regle.html : Page des règles du site.

selectionner-theme.html : Page pour sélectionner un thème.

tournoi.html : Page pour gérer les tournois et les contests.

users.html : Page de gestion des utilisateurs pour les administrateurs.

Dossier /js :

accounte.js : Script pour gérer les interactions sur la page de connexion/inscription (connexion, inscription, déconnexion, alertes).

accueil.js : Script pour la page d'accueil.

app.js : Script principal pour initialiser l'application.

auth.js : Script pour gérer l'authentification côté serveur.

createAdmins.js : Script pour créer des comptes administrateurs dans la base de données.

db.js : Script pour gérer les connexions à la base de données.

regle.js : Script pour la page des règles.

selectionner-theme.js : Script pour la page de sélection de thème.

server.js : Script principal du serveur Node.js.

tournoi.js : Script pour gérer les tournois et les contests.

upload.js : Script pour gérer les téléchargements (non utilisé actuellement).

users.js : Script pour gérer les opérations CRUD des utilisateurs côté serveur.

Dossier /node_modules :

Contient les dépendances Node.js installées (ex. mysql2, bcrypt).

Fichiers racine :

.env : Fichier pour stocker les variables d'environnement (ex. identifiants de la base de données).

package.json : Fichier de configuration du projet Node.js.

package-lock.json : Fichier de verrouillage des dépendances.

Dossier /img :

Dossier prévu pour les images, mais actuellement vide pour minimiser le poids des pages.

Back-end :

Serveur Node.js avec des endpoints /login, /register, /users pour gérer les opérations CRUD.

Base de données :

Base de données MySQL tournoi_db




# Empreinte carbone

Le projet a été optimisé pour réduire son empreinte carbone :

Avant optimisation : 1.38 gCO2 par page (10 000 pages vues/mois : 13 800 gCO2).



Après optimisation : 0.42 gCO2 par page (10 000 pages vues/mois : 4 200 gCO2), soit une réduction de 70 %.


Détails dans le rapport Green IT (Rapport Green IT - VS Zone.pdf).


