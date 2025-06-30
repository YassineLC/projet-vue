// server/services/importGmail.js
import fetch from 'node-fetch';
import { pool } from '../database/init.js';

/**
 * Récupère et insère des mails Gmail par label.
 * @param {string} accessToken 
 * @param {number} userId 
 * @param {'INBOX'|'SENT'} label 
 */
async function importGmailByLabel(accessToken, userId, label) {
  console.log(`🚀 Import Gmail [${label}] pour user ${userId}`);

  const queryLabel = label === 'SENT' ? 'in:sent' : 'in:inbox';
  const listResponse = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${queryLabel}&maxResults=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const listData = await listResponse.json();

  if (!listData.messages) {
    console.log(`⚠️ Aucun message pour label ${label}`, listData);
    return;
  }

  for (const msg of listData.messages) {
    const detailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const msgData = await detailResponse.json();
    const headers = msgData.payload.headers;

    const subject = headers.find(h => h.name === 'Subject')?.value || '(No subject)';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const to = headers.find(h => h.name === 'To')?.value || '';
    const dateHeader = headers.find(h => h.name === 'Date')?.value || '';
    const date = new Date(dateHeader);

    let body = '';
    if (msgData.payload.parts) {
      const part = msgData.payload.parts.find(p => p.mimeType === 'text/plain');
      if (part?.body?.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf8');
      }
    } else if (msgData.payload.body?.data) {
      body = Buffer.from(msgData.payload.body.data, 'base64').toString('utf8');
    }

    if (label === 'INBOX') {
      // Reçus => emails table
      const fromMatch = from.match(/(.*)<(.*)>/);
      const senderName = fromMatch ? fromMatch[1].trim().replace(/"/g, '') : from;
      const senderEmail = fromMatch ? fromMatch[2].trim() : from;

      await pool.query(
        `INSERT INTO emails (user_id, subject, sender_name, sender_email, body, received_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [userId, subject, senderName, senderEmail, body, date]
      );
    } else if (label === 'SENT') {
      // Envoyés => sent_emails table
      const toMatch = to.match(/(.*)<(.*)>/);
      const recipientName = toMatch ? toMatch[1].trim().replace(/"/g, '') : to;
      const recipientEmail = toMatch ? toMatch[2].trim() : to;

      await pool.query(
        `INSERT INTO sent_emails (sender_id, subject, recipient_name, recipient_email, body, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [userId, subject, recipientName, recipientEmail, body, date]
      );
    }
  }

  console.log(`✅✅ Import Gmail [${label}] terminé pour user ${userId}`);
}

/**
 * Point d'entrée unique : importe reçus + envoyés
 */
export async function importGmailEmails(accessToken, userId) {
  await importGmailByLabel(accessToken, userId, 'INBOX');
  await importGmailByLabel(accessToken, userId, 'SENT');
}
