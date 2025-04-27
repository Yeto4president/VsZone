const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { pool, promisePool, initDatabase } = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Route par défaut pour rediriger vers /html/accounte.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'accounte.html'));
});

// Initialiser la base de données
initDatabase();

// Middleware Green IT
const selectFields = (req, res, next) => {
  req.fields = req.query.fields ? req.query.fields.split(',') : null;
  next();
};

// Middleware pour vérifier le rôle admin
const checkAdmin = async (req, res, next) => {
  const email = req.headers['x-user-email'];
  if (!email) {
    return res.status(401).send('Utilisateur non authentifié');
  }

  try {
    const [users] = await promisePool.query('SELECT role FROM Utilisateur WHERE email = ?', [email]);
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).send('Accès interdit : rôle admin requis');
    }
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    res.status(500).send('Erreur lors de la vérification du rôle');
  }
};

// Route pour créer un tournoi
app.post('/creer-tournoi', async (req, res) => {
  const { themeId } = req.body;
  if (!themeId) return res.status(400).send('Le champ themeId est requis.');

  try {
    const [images] = await promisePool.query('SELECT url FROM Image WHERE theme_id = ?', [themeId]);
    if (images.length < 16) return res.status(400).send('Pas assez d\'images pour créer un tournoi.');

    const shuffled = images.sort(() => 0.5 - Math.random()).slice(0, 16);
    const [result] = await promisePool.query('INSERT INTO Tournoi (theme_id, etat) VALUES (?, ?)', [themeId, 'en_cours']);
    const tournoiId = result.insertId;

    for (let i = 0; i < 16; i += 2) {
      const mancheId = `manche_${tournoiId}_${i / 2 + 1}`;
      await promisePool.query(
        'INSERT INTO Manche (id, tournoi_id, image1_id, image2_id, round) VALUES (?, ?, ?, ?, ?)',
        [mancheId, tournoiId, shuffled[i].url, shuffled[i + 1].url, 1]
      );
    }

    res.status(201).json({ tournoiId });
  } catch (error) {
    console.error('Erreur lors de la création du tournoi:', error);
    res.status(500).send('Erreur lors de la création du tournoi.');
  }
});

// Route pour créer les manches suivantes
app.post('/creer-manches-suivantes', async (req, res) => {
  const { tournoiId, winners, round } = req.body;

  if (!tournoiId || !winners || winners.length < 2) {
    return res.status(400).send('Paramètres invalides pour créer les manches suivantes.');
  }

  try {
    for (let i = 0; i < winners.length; i += 2) {
      const mancheId = `manche_${tournoiId}_${Date.now()}_${i}`;
      await promisePool.query(
        'INSERT INTO Manche (id, tournoi_id, image1_id, image2_id, round) VALUES (?, ?, ?, ?, ?)',
        [mancheId, tournoiId, winners[i], winners[i + 1], round]
      );
    }

    res.status(201).json({ message: 'Manches suivantes créées' });
  } catch (error) {
    console.error('Erreur lors de la création des manches suivantes:', error);
    res.status(500).send('Erreur serveur pour les manches suivantes.');
  }
});

// Route pour récupérer les manches
app.get('/manches', async (req, res) => {
  const { tournoi_id } = req.query;
  if (!tournoi_id) return res.status(400).send('Paramètre tournoi_id manquant');

  try {
    const [rows] = await promisePool.query(
      `SELECT m.id, m.image1_id, m.image2_id, m.round, m.gagnant_id,
              COALESCE(i1.nom, i1.url) AS nom1, COALESCE(i2.nom, i2.url) AS nom2
       FROM Manche m
       LEFT JOIN Image i1 ON m.image1_id = i1.url
       LEFT JOIN Image i2 ON m.image2_id = i2.url
       WHERE m.tournoi_id = ?
       ORDER BY m.id`,
      [tournoi_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des manches:', err);
    res.status(500).send('Erreur lors de la récupération des manches');
  }
});

// Route pour voter sur une manche
app.post('/manches/:id/vote', async (req, res) => {
  const mancheId = req.params.id;
  const { gagnant_id } = req.body;

  if (!gagnant_id) return res.status(400).send('Champ gagnant_id manquant');

  try {
    const [result] = await promisePool.query(
      'UPDATE Manche SET gagnant_id = ? WHERE id = ?',
      [gagnant_id, mancheId]
    );

    if (result.affectedRows === 0) return res.status(404).send('Manche non trouvée');

    res.send('Vote enregistré');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du vote:', err);
    res.status(500).send('Erreur lors de l\'enregistrement du vote');
  }
});

// Route pour arrêter ou mettre à jour le tournoi
app.put('/tournois/:id', async (req, res) => {
  const { etat } = req.body;
  const tournoiId = req.params.id;

  if (!etat) return res.status(400).send('Champ "etat" manquant');

  try {
    const [result] = await promisePool.query(
      'UPDATE Tournoi SET etat = ? WHERE id = ?',
      [etat, tournoiId]
    );

    if (result.affectedRows === 0) return res.status(404).send('Tournoi non trouvé');

    res.send('Tournoi mis à jour');
  } catch (err) {
    console.error('Erreur lors de la mise à jour du tournoi:', err);
    res.status(500).send('Erreur lors de la mise à jour du tournoi');
  }
});

// Endpoint pour l'inscription
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Requête d\'inscription reçue:', { username, email });

    if (!username || !email || !password) {
      console.log('Erreur: Champs manquants');
      return res.status(400).send('Nom d\'utilisateur, email et mot de passe requis');
    }

    const [existingUser] = await promisePool.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log('Erreur: Email déjà utilisé:', email);
      return res.status(400).send('Cet email est déjà utilisé');
    }

    const userId = uuidv4();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await promisePool.query(
      'INSERT INTO Utilisateur (id, nom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, 'utilisateur']
    );
    console.log(`Utilisateur inscrit avec succès, ID: ${userId}`);

    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

// Endpoint pour la connexion
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Requête de connexion reçue:', { email });

    if (!email || !password) {
      console.log('Erreur: Champs manquants');
      return res.status(400).send('Email et mot de passe requis');
    }

    const [users] = await promisePool.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log('Erreur: Utilisateur non trouvé:', email);
      return res.status(401).send('Email ou mot de passe incorrect');
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.mdp);
    if (!passwordMatch) {
      console.log('Erreur: Mot de passe incorrect pour:', email);
      return res.status(401).send('Email ou mot de passe incorrect');
    }

    console.log(`Connexion réussie pour: ${email}`);
    res.status(200).json({ message: 'Connexion réussie', username: user.nom, role: user.role });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).send('Erreur lors de la connexion');
  }
});

// CRUD Utilisateur (réservé aux admins)
app.post('/users', checkAdmin, async (req, res) => {
  const { id, nom, email, mdp, role } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mdp, saltRounds);
    await promisePool.query(
      'INSERT INTO Utilisateur (id, nom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      [id || uuidv4(), nom, email, hashedPassword, role || 'utilisateur']
    );
    res.status(201).send('Utilisateur créé');
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    res.status(500).send('Erreur lors de la création de l\'utilisateur');
  }
});

app.get('/users', checkAdmin, selectFields, async (req, res) => {
  try {
    const fields = req.fields || ['id', 'nom', 'email', 'role'];
    const [rows] = await promisePool.query(`SELECT ${fields.join(',')} FROM Utilisateur`);
    res.json(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

app.get('/users/:id', checkAdmin, selectFields, async (req, res) => {
  try {
    const fields = req.fields || ['id', 'nom', 'email', 'role'];
    const [rows] = await promise
