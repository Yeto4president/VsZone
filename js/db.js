const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

const initDatabase = async () => {
  try {
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS utilisateur (
        id VARCHAR(255) PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mdp VARCHAR(255) NOT NULL,
        role ENUM('admin', 'utilisateur') DEFAULT 'utilisateur'
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS theme (
        id VARCHAR(255) PRIMARY KEY,
        nom VARCHAR(255) NOT NULL
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS jeu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        img VARCHAR(255)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS image (
        url VARCHAR(255) PRIMARY KEY,
        jeu_id INT,
        theme_id VARCHAR(255),
        FOREIGN KEY (jeu_id) REFERENCES jeu(id),
        FOREIGN KEY (theme_id) REFERENCES theme(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS tournoi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id VARCHAR(255),
        etat VARCHAR(255) NOT NULL,
        FOREIGN KEY (theme_id) REFERENCES theme(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS manche (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tournoi_id INT,
        image1_id VARCHAR(255),
        image2_id VARCHAR(255),
        gagnant_id VARCHAR(255),
        round INT,
        FOREIGN KEY (tournoi_id) REFERENCES tournoi(id),
        FOREIGN KEY (image1_id) REFERENCES image(url),
        FOREIGN KEY (image2_id) REFERENCES image(url),
        FOREIGN KEY (gagnant_id) REFERENCES image(url)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS utilisateur_tournoi (
        utilisateur_id VARCHAR(255),
        tournoi_id INT,
        PRIMARY KEY (utilisateur_id, tournoi_id),
        FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
        FOREIGN KEY (tournoi_id) REFERENCES tournoi(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS theme_image (
        theme_id VARCHAR(255),
        image_url VARCHAR(255),
        PRIMARY KEY (theme_id, image_url),
        FOREIGN KEY (theme_id) REFERENCES theme(id),
        FOREIGN KEY (image_url) REFERENCES image(url)
      );
    `);

    console.log('Base de données initialisée avec succès.');
  } catch (err) {
    console.error('Erreur lors de l’initialisation de la base de données :', err);
  }
};

module.exports = { pool, promisePool, initDatabase };
