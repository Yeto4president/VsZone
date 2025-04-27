async function startTournament(themeName) {
  try {
    console.log('Création du tournoi pour themeId :', themeName);

    const response = await fetch('/creer-tournoi', { // Correction ici ➔ pas besoin de http://localhost:3000 en fetch depuis ton front
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ themeId: themeName })
    });

    console.log('Statut de la réponse:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur renvoyée par le serveur:', errorText);
      throw new Error(`Erreur lors de la création du tournoi: ${errorText}`);
    }

    const data = await response.json();
    const tournoiId = data.tournoiId;
    console.log('Tournoi créé avec ID:', tournoiId);

    window.location.href = `../html/tournoi.html?tournoiId=${tournoiId}`; // Correction chemin relatif (si ton fichier js est dans /js et ton tournoi.html dans /html)
  } catch (error) {
    console.error('Erreur lors de la création du tournoi:', error);
    alert('Erreur : ' + error.message);
  }
}
