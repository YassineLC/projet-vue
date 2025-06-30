// server/routes/emails.js
import express from 'express'
import { pool } from '../database/init.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// ✅ Toutes les routes sécurisées
router.use(authenticateToken)

/**
 * 📥 Liste des e-mails reçus
 */
router.get('/received', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, sender_name, sender_email, received_at, is_read, has_attachments
       FROM emails
       WHERE user_id = $1 AND is_visible = true
       ORDER BY received_at DESC`,
      [req.user.userId]
    )

    const emails = result.rows.map(email => ({
      id: email.id.toString(),
      subject: email.subject,
      sender: {
        name: email.sender_name,
        email: email.sender_email,
      },
      receivedDateTime: email.received_at.toISOString(),
      isRead: email.is_read,
      hasAttachments: email.has_attachments,
    }))

    res.json({ emails })
  } catch (error) {
    console.error('Erreur lors de la récupération des e-mails reçus :', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des e-mails reçus' })
  }
})

/**
 * 📥 Détail d’un e-mail reçu
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `SELECT id, subject, sender_name, sender_email, body, received_at, is_read, has_attachments
       FROM emails
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'E-mail non trouvé' })
    }

    const email = result.rows[0]

    res.json({
      email: {
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
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du détail de l’e-mail :', error)
    res.status(500).json({ error: 'Erreur interne du serveur' })
  }
})

/**
 * 🗑️ Masquer un e-mail reçu (suppression logique)
 */
router.patch('/:id/hide', async (req, res) => {
  const { id } = req.params

  try {
    await pool.query(
      `UPDATE emails
       SET is_visible = false
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.userId]
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Erreur lors du masquage de l’e-mail :', error)
    res.status(500).json({ error: 'Erreur interne du serveur' })
  }
})

export default router
