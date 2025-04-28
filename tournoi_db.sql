CREATE DATABASE IF NOT EXISTS tournoi_db;
USE tournoi_db;

CREATE TABLE Utilisateur (
    id VARCHAR(255) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    role ENUM('admin', 'utilisateur') DEFAULT 'utilisateur'
);

CREATE TABLE Jeu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    img VARCHAR(255)
);

CREATE TABLE Theme (
    id VARCHAR(255) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);


CREATE TABLE Image (
    url VARCHAR(255) PRIMARY KEY,
    jeu_id INT,
    theme_id VARCHAR(255),
    FOREIGN KEY (jeu_id) REFERENCES Jeu(id),
    FOREIGN KEY (theme_id) REFERENCES Theme(id)
);

CREATE TABLE Tournoi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    theme_id VARCHAR(255),
    etat VARCHAR(255),
    FOREIGN KEY (theme_id) REFERENCES Theme(id)
);

CREATE TABLE Manche (
    id VARCHAR(255) PRIMARY KEY,
    tournoi_id INT,
    image1_id VARCHAR(255),
    image2_id VARCHAR(255),
    gagnant_id VARCHAR(255),
    round INT,
    FOREIGN KEY (tournoi_id) REFERENCES Tournoi(id),
    FOREIGN KEY (image1_id) REFERENCES Image(url),
    FOREIGN KEY (image2_id) REFERENCES Image(url),
    FOREIGN KEY (gagnant_id) REFERENCES Image(url)
);

INSERT INTO Theme (id, nom) VALUES ('theme1', 'Jeux de société');

INSERT INTO Image (url, theme_id) VALUES ('/img/dobble.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/devine-tete.webp', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/tarot.jpeg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/jeu_54_carte.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/SOS_ouistiti.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/hippo_glouton.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/jungle_speed.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/Jeu_de_dame.png', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/echec.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/triominos.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/la_bonne_paye.jpeg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/scrabble.jpeg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/uno.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/monopoly.webp', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/cluedo.webp', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/poker.webp', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/blanc_manger_coco.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/wazabi.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/Loups_Garous.webp', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/mirogolo.jpg', 'theme1');
INSERT INTO Image (url, theme_id) VALUES ('/img/mistigri.jpg', 'theme1');

INSERT INTO Tournoi (theme_id, etat) VALUES ('theme1', 'en cours');

INSERT INTO Theme (id, nom) VALUES ('theme2', 'Jeux Vidéo');
ALTER TABLE Image ADD COLUMN nom VARCHAR(255);
INSERT INTO Image (url, theme_id, nom) VALUES
('/img/Mario_Kart.jpg', 'theme2', 'Mario Kart'),
('/img/Assassins_creed.webp', 'theme2', 'Assassin s creed'),
('/img/pokemon.jpg', 'theme2', 'Pokemon'),
('/img/call_of_duty.webp', 'theme2', 'Call of Duty'),
('/img/fortnite.jpg', 'theme2', 'Fortnite'),
('/img/Minecraft.jpeg', 'theme2', 'Minecraft'),
('/img/red_dead_redemption.jpg', 'theme2', 'Red Dead Redemption'),
('/img/Until_Dawn.jpg', 'theme2', 'Until Dawn'),
('/img/League_of_Legends.jpeg', 'theme2', 'League of Legends'),
('/img/Valorant.jpg', 'theme2', 'Valorant'),
('/img/Animal_Crossing.jpg', 'theme2', 'Animal Crossing'),
('/img/Smash_Bros.jpg', 'theme2', 'Smash Bros'),
('/img/donkey_kong.jpg', 'theme2', 'Donkey Kong'),
('/img/fc25.avif', 'theme2', 'FIFA'),
('/img/2K24.jpg', 'theme2', 'NBA 2K'),
('/img/Rocket_League.jpg', 'theme2', 'Rocket League'),
('/img/elden_ring.webp', 'theme2', 'Elden Ring'),
('/img/gran_turismo.jpg', 'theme2', 'Gran Turismo'),
('/img/gta.jpeg', 'theme2', 'GTA');

UPDATE Image SET nom = 'Dobble' WHERE url = '/img/dobble.jpg';
UPDATE Image SET nom = 'Devine Tête' WHERE url = '/img/devine-tete.webp';
UPDATE Image SET nom = 'Tarot' WHERE url = '/img/tarot.jpeg';
UPDATE Image SET nom = 'Jeu de 54 cartes' WHERE url = '/img/jeu_54_carte.jpg';
UPDATE Image SET nom = 'SOS Ouistiti' WHERE url = '/img/SOS_ouistiti.jpg';
UPDATE Image SET nom = 'Hippo Glouton' WHERE url = '/img/hippo_glouton.jpg';
UPDATE Image SET nom = 'Jungle Speed' WHERE url = '/img/jungle_speed.jpg';
UPDATE Image SET nom = 'Jeu de Dames' WHERE url = '/img/Jeu_de_dame.png';
UPDATE Image SET nom = 'Échecs' WHERE url = '/img/echec.jpg';
UPDATE Image SET nom = 'Triominos' WHERE url = '/img/triominos.jpg';
UPDATE Image SET nom = 'La Bonne Paye' WHERE url = '/img/la_bonne_paye.jpeg';
UPDATE Image SET nom = 'Scrabble' WHERE url = '/img/scrabble.jpeg';
UPDATE Image SET nom = 'Uno' WHERE url = '/img/uno.jpg';
UPDATE Image SET nom = 'Monopoly' WHERE url = '/img/monopoly.webp';
UPDATE Image SET nom = 'Cluedo' WHERE url = '/img/cluedo.webp';
UPDATE Image SET nom = 'Poker' WHERE url = '/img/poker.webp';
UPDATE Image SET nom = 'Blanc Manger Coco' WHERE url = '/img/blanc_manger_coco.jpg';
UPDATE Image SET nom = 'Wazabi' WHERE url = '/img/wazabi.jpg';
UPDATE Image SET nom = 'Loups Garous' WHERE url = '/img/Loups_Garous.webp';
UPDATE Image SET nom = 'Mirogolo' WHERE url = '/img/mirogolo.jpg';
UPDATE Image SET nom = 'Mistigri' WHERE url = '/img/mistigri.jpg';

select * from image;