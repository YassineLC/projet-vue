import express from 'express';
import { pool } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware d'authentification
router.use(authenticateToken);

/**
 * Récupération des e-mails reçus
 */
router.get('/received', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, sender_name, sender_email, body, 
              received_at, is_read, has_attachments, is_visible
       FROM emails 
       WHERE user_id = $1 AND is_visible = true
       ORDER BY received_at DESC`,
      [req.user.userId]
    );

    const emails = result.rows.map(email => ({
      id: email.id.toString(),
      subject: email.subject,
      sender: {
        name: email.sender_name,
        email: email.sender_email,
      },
      body: email.body,
      receivedDateTime: email.received_at.toISOString(),
      isRead: email.is_read,
      hasAttachments: email.has_attachments,
      isVisible: email.is_visible,
    }));

    res.json({ emails });
  } catch (error) {
    console.error('Erreur lors de la récupération des e-mails reçus:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * Récupération des e-mails envoyés
 */
router.get('/sent', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, recipient_name, recipient_email, body, 
              sent_at, has_attachments
       FROM sent_emails 
       WHERE sender_id = $1
       ORDER BY sent_at DESC`,
      [req.user.userId]
    );

    const emails = result.rows.map(email => ({
      id: email.id.toString(),
      subject: email.subject,
      recipient: {
        name: email.recipient_name,
        email: email.recipient_email,
      },
      body: email.body,
      sentDateTime: email.sent_at.toISOString(),
      hasAttachments: email.has_attachments,
    }));

    res.json({ emails });
  } catch (error) {
    console.error('Erreur lors de la récupération des e-mails envoyés:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;