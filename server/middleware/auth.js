import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '17191ddab728c26e0a1434e46cd9b8cab967708ff7afcc895ea368c3217434d1d41ea87067c7a3669cc24a08cb2edba95a7d8832259f0da9fe2a8299d990eb38';

/**
 * Middleware d'authentification JWT
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token d\'accès requis',
      code: 'NO_TOKEN'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Erreur de vérification du token:', err.message);
      return res.status(403).json({ 
        error: 'Token invalide ou expiré',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware optionnel pour vérifier l'authentification sans bloquer
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }

  next();
};