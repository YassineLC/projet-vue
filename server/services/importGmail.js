import fetch from 'node-fetch'
import { pool } from '../database/init.js'

/**
 * Récupère et insère jusqu'à 10 nouveaux mails Gmail par label (INBOX ou SENT).
 * @param {string} accessToken 
 * @param {number} userId 
 * @param {'INBOX'|'SENT'} label 
 */
async function importGmailByLabel(accessToken, userId, label) {
  console.log(`🚀 Import Gmail [${label}] pour user ${userId}`)

  const queryLabel = label === 'SENT' ? 'in:sent' : 'in:inbox'
  let imported = 0
  let pageToken = undefined
  const maxToImport = 10

  while (imported < maxToImport) {
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${queryLabel}&maxResults=10`
    if (pageToken) url += `&pageToken=${pageToken}`

    const listResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const listData = await listResponse.json()

    if (!listData.messages || listData.messages.length === 0) {
      console.log(`⚠️ Aucun message pour label ${label}`, listData)
      break
    }

    for (const msg of listData.messages) {
      // Vérifie si le mail existe déjà (par gmail_id)
      let table = label === 'INBOX' ? 'emails' : 'sent_emails'
      let idField = 'gmail_id'
      let userField = label === 'INBOX' ? 'user_id' : 'sender_id'

      const exists = await pool.query(
        `SELECT 1 FROM ${table} WHERE ${idField} = $1 AND ${userField} = $2`,
        [msg.id, userId]
      )
      if (exists.rows.length > 0) continue // déjà importé

      // Récupère le détail du mail
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const msgData = await detailResponse.json()
      const headers = msgData.payload.headers

      const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)'
      const from = headers.find(h => h.name === 'From')?.value || ''
      const to = headers.find(h => h.name === 'To')?.value || ''
      const dateHeader = headers.find(h => h.name === 'Date')?.value || ''
      const date = new Date(dateHeader)

      let body = ''
      if (msgData.payload.parts) {
        const part = msgData.payload.parts.find(p => p.mimeType === 'text/plain')
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf8')
        }
      } else if (msgData.payload.body?.data) {
        body = Buffer.from(msgData.payload.body.data, 'base64').toString('utf8')
      }

      if (label === 'INBOX') {
        // Reçus => emails table
        const fromMatch = from.match(/(.*)<(.*)>/)
        const senderName = fromMatch ? fromMatch[1].trim().replace(/"/g, '') : from
        const senderEmail = fromMatch ? fromMatch[2].trim() : from

        // Statut lu/non lu selon Gmail
        const isRead = !msgData.labelIds?.includes('UNREAD')

        await pool.query(
          `INSERT INTO emails (gmail_id, user_id, subject, sender_name, sender_email, body, received_at, is_read)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (gmail_id, user_id) DO NOTHING`,
          [msg.id, userId, subject, senderName, senderEmail, body, date, isRead]
        )
      } else if (label === 'SENT') {
        // Envoyés => sent_emails table
        const toMatch = to.match(/(.*)<(.*)>/)
        const recipientName = toMatch ? toMatch[1].trim().replace(/"/g, '') : to
        const recipientEmail = toMatch ? toMatch[2].trim() : to

        await pool.query(
          `INSERT INTO sent_emails (gmail_id, sender_id, subject, recipient_name, recipient_email, body, sent_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (gmail_id, sender_id) DO NOTHING`,
          [msg.id, userId, subject, recipientName, recipientEmail, body, date]
        )
      }
      imported++
      if (imported >= maxToImport) break
    }

    if (!listData.nextPageToken) break
    pageToken = listData.nextPageToken
  }

  console.log(`✅✅ Import Gmail [${label}] terminé pour user ${userId}`)
}

/**
 * Point d'entrée unique : importe reçus + envoyés
 */
export async function importGmailEmails(accessToken, userId) {
  await importGmailByLabel(accessToken, userId, 'INBOX')
  await importGmailByLabel(accessToken, userId, 'SENT')
}