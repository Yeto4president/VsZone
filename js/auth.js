// Middleware pour vérifier l'authentification
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).send('Non autorisé');
  }
}

module.exports = { isAuthenticated };
