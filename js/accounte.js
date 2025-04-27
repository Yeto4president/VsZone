document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const authContainer = document.getElementById('auth-container');
  const userStatus = document.getElementById('user-status');
  const connectionAlert = document.getElementById('connection-alert');

  // Fonction pour afficher une alerte temporaire
  function showConnectionAlert(message) {
    connectionAlert.textContent = message;
    connectionAlert.classList.remove('hidden');
    setTimeout(() => {
      connectionAlert.classList.add('hidden');
    }, 5000); // Disparaît après 5 secondes
  }

  // Vérifier si un utilisateur est connecté pour mettre à jour la barre de navigation
  function checkUserSession() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    if (username && email && role) {
      userStatus.innerHTML = `Bienvenue, ${username} <a href="#" id="logout-nav">Déconnexion</a>`;
      if (role === 'admin') {
        userStatus.insertAdjacentHTML('afterbegin', `<a href="users.html">Utilisateurs</a> | `);
      }
      document.getElementById('logout-nav').addEventListener('click', logout);
    } else {
      authContainer.classList.remove('hidden');
      userStatus.innerHTML = `<a href="accounte.html">Connexion</a>`;
    }
  }

  // Gestion des onglets Connexion / Inscription
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.add('hidden'));
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.remove('hidden');
    });
  });

  // Gestion du formulaire de connexion
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      console.log('Tentative de connexion:', { email });
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Statut de la réponse:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur lors de la connexion:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Connexion réussie:', data);

      // Stocker les informations de l'utilisateur dans localStorage
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', email);
      localStorage.setItem('role', data.role);

      // Afficher l'alerte de connexion
      showConnectionAlert(`Connecté en tant que ${data.username}`);

      // Rediriger selon le rôle
      const message = `L'utilisateur ${data.username} est connecté`;
      if (data.role === 'admin') {
        window.location.href = `/html/users.html?message=${encodeURIComponent(message)}`;
      } else {
        window.location.href = `/html/accueil.html?message=${encodeURIComponent(message)}`;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      showConnectionAlert('Erreur : ' + error.message);
    }
  });

  // Gestion du formulaire d'inscription
  document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;

    if (password !== passwordConfirm) {
      showConnectionAlert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      console.log('Tentative d\'inscription:', { username, email });
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      console.log('Statut de la réponse:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur lors de l\'inscription:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('Inscription réussie:', data);

      // Afficher une alerte d'inscription réussie
      showConnectionAlert('Inscription réussie ! Veuillez vous connecter.');
      document.querySelector('.tab-button[data-tab="login"]').click();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showConnectionAlert('Erreur : ' + error.message);
    }
  });

  // Gestion de la déconnexion
  function logout(e) {
    e.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    userStatus.innerHTML = `<a href="accounte.html">Connexion</a>`;
    showConnectionAlert('Vous êtes déconnecté.');
  }

  // Vérifier l'état de la session au chargement
  checkUserSession();
});