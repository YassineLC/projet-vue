import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/emails.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur backend opérationnel' });
});

// Servir les fichiers statiques du build frontend (si ils existent)
const frontendPath = join(__dirname, '../dist');
app.use(express.static(frontendPath));

// Route catch-all pour le frontend (SPA)
app.get('*', (req, res) => {
  // Si la requête commence par /api, retourner une erreur 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  
  // Sinon, servir l'index.html du frontend
  res.sendFile(join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send(`
        <h1>Frontend non disponible</h1>
        <p>Assurez-vous que le frontend Vue.js est démarré sur <a href="http://localhost:5173">http://localhost:5173</a></p>
        <p>Ou buildez le frontend avec: <code>npm run build</code></p>
      `);
    }
  });
});

// Initialisation de la base de données et démarrage du serveur
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✅ Base de données initialisée');
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
      console.log(`🎨 Frontend disponible sur http://localhost:${PORT} (si buildé)`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();