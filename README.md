# 🌱 VS Zone - Plateforme Écologique de Tournois en Ligne

![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql)
![Eco-Design](https://img.shields.io/badge/Empreinte_Carbone-0.42gCO2%2Fpage-4BC0A0)

---

## 🎯 Présentation

**VS Zone** est une plateforme web éco-conçue dédiée à l’organisation de **tournois en ligne**. Pensée pour minimiser son impact environnemental, elle intègre des pratiques de Green IT tout en garantissant une expérience utilisateur fluide.

📉 *Empreinte carbone réduite de 70 % après optimisation.*

---

## 🛠️ Installation & Lancement

### ✅ Prérequis

- **Node.js** `>= 14`
- **MySQL** `>= 8`

### 📦 Étapes d’installation

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/vs-zone.git
cd vs-zone

# 2. Initialiser la base de données
mysql -u root -p tournoi_db < database/tournoi_db.sql

# 3. Configurer les variables d'environnement
echo "DB_HOST=localhost" > .env
echo "DB_USER=votre_user" >> .env
echo "DB_PASS=votre_mdp" >> .env
echo "DB_NAME=tournoi_db" >> .env

# 4. Installer les dépendances
npm install

# 5. Lancer le serveur
node server.js

```
---
### 🧭 Structure du Projet
```bash
vs-zone/
├── css/
│   ├── accounte.css
│   ├── accueil.css
│   ├── regle.css
│   ├── selectionner-theme.css
│   ├── tournoi.css
│   └── users.css
│
├── html/
│   ├── accounte.html
│   ├── accueil.html
│   ├── regle.html
│   ├── selectionner-theme.html
│   ├── tournoi.html
│   └── users.html
│
├── js/
│   ├── accounte.js
│   ├── accueil.js
│   ├── app.js
│   ├── auth.js
│   ├── createAdmins.js
│   ├── db.js
│   ├── regle.js
│   ├── selectionner-theme.js
│   ├── server.js
│   ├── tournoi.js
│   ├── upload.js
│   └── users.js
│
├── img/                  
├── node_modules/         # Dépendances Node.js
├── .env                  # Variables d’environnement
├── package.json          # Dépendances et scripts
└── package-lock.json     # Verrouillage des versions
```
---
## 🔐 Fonctionnalités Backend
 
- Authentification sécurisée : POST /login, POST /register

- Gestion des utilisateurs : GET/POST/PUT/DELETE /users

- Gestion des tournois : endpoints CRUD

- Base de données MySQL : tournoi_db

---
## 🍃 Éco-Conception

Le projet a été conçu pour réduire son empreinte carbone numérique :

- Mesure	Avant Optimisation	Après Optimisation
- Empreinte carbone par page	1.38 gCO₂	0.42 gCO₂
- Estimation mensuelle (10k vues)	13 800 gCO₂	4 200 gCO₂
  
📄 Rapport complet disponible dans : Rapport Green IT.pdf


