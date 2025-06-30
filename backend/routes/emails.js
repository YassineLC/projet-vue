const express = require('express');
const router = express.Router();
const db = require('../db'); // Assurez-vous que votre base de données est configurée

// Endpoint pour récupérer les e-mails reçus
router.get('/received', async (req, res) => {
  try {
    const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié et que son ID est disponible
    const emails = await db.query(
      'SELECT * FROM emails WHERE user_id = $1 AND is_visible = true ORDER BY received_at DESC',
      [userId]
    );
    res.json({ emails: emails.rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des e-mails reçus:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des e-mails reçus' });
  }
});

module.exports = router;
