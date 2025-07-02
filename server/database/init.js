import pg from 'pg';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const { Pool } = pg;

/**
 * Configuration de la connexion PostgreSQL
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'email_manager',
  password: process.env.DB_PASSWORD || 'postgresql',
  port: parseInt(process.env.DB_PORT) || 5432,
});

console.log('Configuration DB:', {
  user: pool.options.user,
  host: pool.options.host,
  database: pool.options.database,
  port: pool.options.port,
  password: '***'
});

/**
 * Initialise la base de données avec les tables nécessaires
 */
export const initDatabase = async () => {
  try {
    // Supprimer les tables existantes si elles existent
    await pool.query(`
      DROP TABLE IF EXISTS emails CASCADE;
      DROP TABLE IF EXISTS sent_emails CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Table users avec google_access_token
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        oauth_provider VARCHAR(50),
        oauth_id VARCHAR(255),
        google_access_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table emails avec gmail_id et index unique
    await pool.query(`
      CREATE TABLE emails (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        gmail_id TEXT,
        subject VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255),
        sender_email VARCHAR(255),
        body TEXT,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT false,
        has_attachments BOOLEAN DEFAULT false,
        is_visible BOOLEAN DEFAULT true,
        UNIQUE (gmail_id, user_id)
      );
    `);

    // Table sent_emails avec gmail_id et index unique
    await pool.query(`
      CREATE TABLE sent_emails (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        gmail_id TEXT,
        subject VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255),
        recipient_email VARCHAR(255),
        body TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (gmail_id, sender_id)
      );
    `);

    console.log('✅ Tables créées ou vérifiées');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};

export { pool };