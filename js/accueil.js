// Exemple de script pour la page "accueil"
console.log("Page Accueil chargée !");

// Bouton "Sélectionner un thème"
const startBtn = document.querySelector(".btn-cta");
if (startBtn) {
  startBtn.addEventListener("click", (e) => {
    // Exemple d’action au clic : simple console.log ou redirection
    console.log("Redirection vers la page de sélection de thème...");
  });
}
