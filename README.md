# Gestionnaire d'E-mails Vue.js

Un gestionnaire d'e-mails moderne développé avec Vue.js 3, TypeScript et Tailwind CSS, avec authentification personnalisée et base de données PostgreSQL locale.

## 🚀 Fonctionnalités

### Fonctionnalités principales
- ✅ **Authentification personnalisée** - Inscription/connexion avec JWT
- ✅ **Authentification OAuth** - Connexion avec Google et callback sécurisé
- ✅ **Base de données PostgreSQL** - Stockage local des utilisateurs et e-mails
- ✅ **Gestion des e-mails** - Ajout/suppression d'e-mails dans la liste
- ✅ **Lecture détaillée** - Page dédiée pour lire le contenu complet des e-mails
- ✅ **Recherche avancée** - Filtrage par expéditeur, mot-clé, date ou combinaison
- ✅ **API REST** - Backend Express.js avec endpoints sécurisés

## 🛠️ Technologies utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique pour JavaScript
- **Vue Router** - Routage côté client (6 routes)
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **Vite** - Outil de build moderne et rapide
- **Lucide Vue** - Icônes modernes et accessibles
- **Date-fns** - Gestion et formatage des dates

### Backend
- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web pour Node.js
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage sécurisé des mots de passe

## 📁 Structure du projet

```
├── src/                    # Frontend Vue.js
│   ├── stores/            # Gestion d'état
│   │   ├── authStore.ts   # Authentification et OAuth
│   │   └── emailStore.ts  # Gestion des e-mails
│   ├── views/             # Pages de l'application
│   │   ├── Home.vue       # Page d'accueil
│   │   ├── Login.vue      # Connexion/inscription
│   │   ├── AuthCallback.vue # Callback OAuth Google
│   │   ├── EmailList.vue  # Liste des e-mails
│   │   ├── EmailDetail.vue # Détail d'un e-mail
│   │   └── Profile.vue    # Profil utilisateur
│   ├── router/            # Configuration des routes
│   └── main.ts            # Point d'entrée
├── server/                # Backend Express.js (principal)
│   ├── database/          # Configuration base de données
│   ├── routes/            # Routes API
│   │   ├── auth.js        # Authentification et OAuth
│   │   └── emails.js      # Gestion des e-mails
│   ├── middleware/        # Middlewares de sécurité
│   └── index.js           # Serveur principal
├── backend/               # Backend alternatif (MongoDB - legacy)
└── README.md
```

## 🚦 Routes de l'application

1. **/** - Page d'accueil avec tableau de bord
2. **/login** - Page de connexion/inscription
3. **/auth/callback** - Callback pour l'authentification OAuth Google
4. **/emails** - Liste des e-mails avec fonctionnalités de recherche
5. **/email/:id** - Page de détail d'un e-mail spécifique
6. **/profile** - Profil utilisateur et statistiques

## 🗄️ API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `GET /api/auth/verify` - Vérification du token
- `GET /api/auth/google` - Redirection vers Google OAuth
- `GET /api/auth/google/callback` - Callback OAuth Google

### E-mails
- `GET /api/emails` - Liste des e-mails (avec filtres)
- `GET /api/emails/:id` - Détail d'un e-mail
- `POST /api/emails` - Ajouter un e-mail
- `DELETE /api/emails/:id` - Masquer un e-mail
- `PATCH /api/emails/:id/read` - Marquer comme lu

## ⚙️ Installation et configuration

### 1. Prérequis
- Node.js (v18+)
- PostgreSQL (v12+)
- npm

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration de la base de données
1. Créez une base de données PostgreSQL nommée `email_manager`
2. Copiez `.env.example` vers `.env`
3. Configurez vos paramètres de base de données dans `.env`

### 4. Variables d'environnement
```env
# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=email_manager
DB_USER=postgres
DB_PASSWORD=your_password

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Port du serveur backend
PORT=3001

# Configuration OAuth Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

### 5. Lancement de l'application

#### Démarrage simultané du backend et du frontend
```bash
npm run dev:full
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## 🔒 Sécurité

- **Authentification JWT** - Tokens sécurisés avec expiration
- **OAuth 2.0 Google** - Authentification sécurisée via Google
- **Hashage des mots de passe** - bcryptjs avec salt
- **Validation des données** - Validation côté serveur
- **Protection CORS** - Configuration sécurisée
- **Sanitisation HTML** - Protection contre XSS
- **Middleware d'authentification** - Vérification automatique des tokens

## 📊 Base de données

### Table `users`
- `id` - Identifiant unique
- `email` - Email unique
- `password_hash` - Mot de passe hashé
- `name` - Nom complet
- `avatar_url` - URL de l'avatar (optionnel)
- `created_at` - Date de création

### Table `emails`
- `id` - Identifiant unique
- `user_id` - Référence vers l'utilisateur
- `subject` - Objet de l'e-mail
- `sender_name` - Nom de l'expéditeur
- `sender_email` - Email de l'expéditeur
- `body` - Contenu de l'e-mail
- `received_at` - Date de réception
- `is_read` - Statut de lecture
- `has_attachments` - Présence de pièces jointes
- `is_visible` - Visibilité (suppression logique)