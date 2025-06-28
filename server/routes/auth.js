import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Initier l'authentification OAuth Google
 */
router.get('/google', (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=openid%20email%20profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(googleAuthURL);
});

/**
 * Callback OAuth Google
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      console.error('Erreur : Aucun code reçu dans le callback OAuth');
      return res.redirect(`http://localhost:5173/login?error=no_code`);
    }

    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Erreur : Échec de l\'échange du code contre un token', tokenData);
      return res.redirect(`http://localhost:5173/login?error=token_exchange_failed`);
    }

    // Récupérer les informations utilisateur de Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json();
    console.log('Utilisateur Google récupéré :', googleUser);

    // Vérifier si l'utilisateur existe déjà
    let result = await pool.query(
      'SELECT id, email, name, avatar_url, oauth_provider, oauth_id FROM users WHERE email = $1',
      [googleUser.email]
    );

    let user;
    if (result.rows.length > 0) {
      user = result.rows[0];
      console.log('Utilisateur existant mis à jour :', user);
      await pool.query(
        'UPDATE users SET name = $1, avatar_url = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [googleUser.name, googleUser.picture, user.id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO users (email, name, avatar_url, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, avatar_url',
        [googleUser.email, googleUser.name, googleUser.picture, 'google', googleUser.id]
      );
      user = result.rows[0];
      console.log('Nouvel utilisateur créé :', user);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Erreur lors du callback OAuth Google :', error);
    res.redirect(`http://localhost:5173/login?error=auth_failed`);
  }
});

/**
 * Récupération du profil utilisateur
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photo: user.avatar_url,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * Vérification de la validité du token
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: { 
      id: req.user.userId, 
      email: req.user.email 
    } 
  });
});

/**
 * Déconnexion (côté client, suppression du token)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

export default router;