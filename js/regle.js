// Exemple de script pour la page "règle"
console.log("Page Règle chargée !");

// Vous pouvez ajouter ici des interactions JavaScript
// Par exemple, un clic sur le bouton "Accéder au quizz" pour rediriger :
const ctaButton = document.querySelector(".btn-cta");
if (ctaButton) {
  ctaButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "selectionner-theme.html"; 
  });
}
