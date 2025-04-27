document.addEventListener('DOMContentLoaded', async function() {
  const userTableBody = document.querySelector('#userTable tbody');
  const addUserForm = document.getElementById('addUserForm');

  // Vérifier si l'utilisateur est un admin
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  if (!email || role !== 'admin') {
    alert('Accès interdit : vous devez être administrateur pour accéder à cette page.');
    window.location.href = '/html/accueil.html';
    return;
  }

  // Afficher un message si présent dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');
  if (message) {
    alert(decodeURIComponent(message));
  }

  // Charger la liste des utilisateurs
  async function loadUsers() {
    try {
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'X-User-Email': email
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const users = await response.json();
      userTableBody.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.nom}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button onclick="editUser('${user.email}', '${user.nom}', '${user.role}')">Modifier</button>
            <button onclick="deleteUser('${user.email}')">Supprimer</button>
          </td>
        `;
        userTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      alert('Erreur : ' + error.message);
    }
  }

  // Gestion du formulaire d'ajout d'utilisateur
  addUserForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // ID unique
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': localStorage.getItem('email')
        },
        body: JSON.stringify({ id, nom: username, email, mdp: password, role })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert('Utilisateur ajouté avec succès !');
      addUserForm.reset();
      loadUsers();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      alert('Erreur : ' + error.message);
    }
  });

  // Fonction pour modifier un utilisateur
  window.editUser = async function(email, nom, role) {
    const newNom = prompt('Nouveau nom :', nom);
    const newEmail = prompt('Nouvel email :', email);
    const newPassword = prompt('Nouveau mot de passe (laisser vide pour ne pas changer) :');
    const newRole = prompt('Nouveau rôle (admin/utilisateur) :', role);

    if (newNom && newEmail && newRole) {
      try {
        const body = { nom: newNom, email: newEmail, role: newRole };
        if (newPassword) body.mdp = newPassword;

        const response = await fetch(`http://localhost:3000/users/${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': localStorage.getItem('email')
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        alert('Utilisateur mis à jour avec succès !');
        loadUsers();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        alert('Erreur : ' + error.message);
      }
    }
  };

  // Fonction pour supprimer un utilisateur
  window.deleteUser = async function(email) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`http://localhost:3000/users/${email}`, {
          method: 'DELETE',
          headers: {
            'X-User-Email': localStorage.getItem('email')
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        alert('Utilisateur supprimé avec succès !');
        loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        alert('Erreur : ' + error.message);
      }
    }
  };

  // Charger les utilisateurs au démarrage
  loadUsers();
});