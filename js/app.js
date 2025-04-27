const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const { pool, promisePool, initDatabase } = require('./db');
const upload = require('./upload');
const { isAuthenticated } = require('./auth');

dotenv.config();

const app = express();

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (images)
app.use('/img', express.static(path.join(__dirname, 'img')));

// Middleware pour la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'un_secret_par_defaut',
  resave: false,
  saveUninitialized: true
}));

// Initialise la base de données
initDatabase();

// Route principale
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Green IT 🎮🌱');
});

// Route pour l'upload d'image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.');
  }
  res.send('Image téléchargée avec succès !');
});

// Route pour créer un tournoi aléatoire
app.post('/creer-tournoi', async (req, res) => {
  const { themeId } = req.body;
  if (!themeId) {
    return res.status(400).send('Thème non spécifié.');
  }

  try {
    // Sélectionner toutes les images pour ce thème
    const [images] = await promisePool.query(
      'SELECT url FROM image WHERE theme_id = ?',
      [themeId]
    );

    if (images.length < 16) {
      return res.status(400).send('Pas assez d\'images pour créer un tournoi.');
    }

    // Mélanger et prendre 16 images aléatoirement
    const shuffled = images.sort(() => 0.5 - Math.random());
    const selectedImages = shuffled.slice(0, 16);

    // Créer un nouveau tournoi
    const [result] = await promisePool.query(
      'INSERT INTO tournoi (theme_id, etat) VALUES (?, ?)',
      [themeId, 'en_cours']
    );
    const tournoiId = result.insertId;

    // Créer les manches
    for (let i = 0; i < selectedImages.length; i += 2) {
      await promisePool.query(
        'INSERT INTO manche (id, tournoi_id, image1_id, image2_id, round) VALUES (UUID(), ?, ?, ?, ?)',
        [tournoiId, selectedImages[i].url, selectedImages[i + 1].url, 1]
      );
    }

    res.status(201).json({ tournoiId });
  } catch (error) {
    console.error('Erreur lors de la création du tournoi:', error);
    res.status(500).send('Erreur lors de la création du tournoi.');
  }
});

module.exports = app;

