const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmins() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '091204',
    database: 'tournoi_db'
  });

  const admins = [
    { id: 'admin1', nom: 'Admin1', email: 'admin1@example.com', mdp: 'adminpass1', role: 'admin' },
    { id: 'admin2', nom: 'Admin2', email: 'admin2@example.com', mdp: 'adminpass2', role: 'admin' },
    { id: 'admin3', nom: 'Admin3', email: 'admin3@example.com', mdp: 'adminpass3', role: 'admin' }
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.mdp, 10);
    await connection.execute(
      'INSERT INTO Utilisateur (id, nom, email, mdp, role) VALUES (?, ?, ?, ?, ?)',
      [admin.id, admin.nom, admin.email, hashedPassword, admin.role]
    );
    console.log(`Admin ${admin.nom} créé avec succès.`);
  }

  await connection.end();
}

createAdmins().catch(err => console.error('Erreur lors de la création des admins:', err));