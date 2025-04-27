let currentTournoiId = null;
let manches = [];
let currentRoundPlayers = []; // Liste des joueurs en cours
let currentMancheIndex = 0;

function getTournoiIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('tournoiId');
}

async function loadManches() {
  currentTournoiId = getTournoiIdFromURL();
  if (!currentTournoiId) {
    alert('Aucun tournoi sélectionné.');
    return;
  }

  try {
    const response = await fetch(`/manches?tournoi_id=${currentTournoiId}`);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    manches = await response.json();
    if (manches.length === 0) {
      alert('Aucune manche trouvée pour ce tournoi.');
      return;
    }
    // Démarrer avec les 16 images récupérées
    currentRoundPlayers = [];
    manches.forEach(m => {
      currentRoundPlayers.push(m.image1_id, m.image2_id);
    });
    startNextRound();
  } catch (err) {
    console.error('Erreur lors du chargement des manches:', err);
    alert('Erreur lors du chargement des manches: ' + err.message);
  }
}

function startNextRound() {
  if (currentRoundPlayers.length === 1) {
    displayWinner(currentRoundPlayers[0]);
    return;
  }

  manches = [];
  for (let i = 0; i < currentRoundPlayers.length; i += 2) {
    manches.push({
      image1_id: currentRoundPlayers[i],
      image2_id: currentRoundPlayers[i + 1],
    });
  }
  currentMancheIndex = 0;
  currentRoundPlayers = []; // Réinitialiser pour le tour suivant
  displayManche();
}

function displayManche() {
  if (currentMancheIndex >= manches.length) {
    startNextRound();
    return;
  }

  const manche = manches[currentMancheIndex];
  document.getElementById('leftImage').src = manche.image1_id;
  document.getElementById('rightImage').src = manche.image2_id;
  document.getElementById('leftName').textContent = extractName(manche.image1_id);
  document.getElementById('rightName').textContent = extractName(manche.image2_id);

  // Toujours réafficher au cas où on a caché les boutons/nom après la finale
  document.getElementById('rightImage').style.display = 'block';
  document.getElementById('leftButton').style.display = 'inline-block';
  document.getElementById('rightButton').style.display = 'inline-block';
  document.getElementById('rightName').style.display = 'block';
}

function extractName(url) {
  if (!url) return '';
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
}

async function selectChoice(side) {
  const manche = manches[currentMancheIndex];
  const gagnant_id = side === 'left' ? manche.image1_id : manche.image2_id;

  currentRoundPlayers.push(gagnant_id);

  currentMancheIndex++;
  displayManche();
}

function displayWinner(winnerUrl) {
  document.getElementById('leftImage').src = winnerUrl;
  document.getElementById('rightImage').style.display = 'none';
  document.getElementById('leftName').textContent = "🏆 Grand Gagnant ! " + extractName(winnerUrl);
  document.getElementById('rightName').style.display = 'none';
  document.getElementById('leftButton').style.display = 'none';
  document.getElementById('rightButton').style.display = 'none';
}

async function stopQuiz() {
  if (!currentTournoiId) return;

  try {
    const response = await fetch(`/tournois/${currentTournoiId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etat: 'terminé' })
    });

    if (response.ok) {
      alert('Tournoi arrêté.');
      window.location.href = '../html/accueil.html';
    } else {
      const result = await response.text();
      alert('Erreur lors de l’arrêt du tournoi: ' + result);
    }
  } catch (err) {
    console.error('Erreur lors de l’arrêt du tournoi:', err);
    alert('Erreur lors de l’arrêt du tournoi');
  }
}

window.onload = loadManches;
