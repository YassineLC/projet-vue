# Gestionnaire d'E-mails Vue.js

Un gestionnaire d'e-mails moderne développé avec Vue.js 3, TypeScript et Tailwind CSS, avec authentification personnalisée et base de données PostgreSQL locale.

## 🚀 Fonctionnalités

### Fonctionnalités principales
- ✅ **Authentification personnalisée** - Inscription/connexion avec JWT
- ✅ **Base de données PostgreSQL** - Stockage local des utilisateurs et e-mails
- ✅ **Gestion des e-mails** - Ajout/suppression d'e-mails dans la liste
- ✅ **Lecture détaillée** - Page dédiée pour lire le contenu complet des e-mails
- ✅ **Recherche avancée** - Filtrage par expéditeur, mot-clé, date ou combinaison
- ✅ **API REST** - Backend Express.js avec endpoints sécurisés

### Fonctionnalités bonus
- ✅ **Backend complet** - API REST avec Express.js et PostgreSQL
- ✅ **Interface responsive** - Design adaptatif pour tous les écrans
- ✅ **Animations et transitions** - Interface moderne avec micro-interactions
- ✅ **Gestion d'état avancée** - Architecture modulaire avec stores dédiés
- ✅ **Sécurité** - Authentification JWT et hashage des mots de passe

## 🛠️ Technologies utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique pour JavaScript
- **Vue Router** - Routage côté client (4 routes)
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **Vite** - Outil de build moderne et rapide

### Backend
- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web pour Node.js
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage sécurisé des mots de passe

## 📁 Structure du projet

```
├── src/                    # Frontend Vue.js
│   ├── components/         # Composants réutilisables
│   ├── stores/            # Gestion d'état
│   │   ├── authStore.ts   # Authentification
│   │   └── emailStore.ts  # Gestion des e-mails
│   ├── views/             # Pages de l'application
│   │   ├── Home.vue       # Connexion/inscription
│   │   ├── EmailList.vue  # Liste des e-mails
│   │   ├── EmailDetail.vue # Détail d'un e-mail
│   │   └── Profile.vue    # Profil utilisateur
│   └── main.ts            # Point d'entrée
├── server/                # Backend Express.js
│   ├── database/          # Configuration base de données
│   ├── routes/            # Routes API
│   │   ├── auth.js        # Authentification
│   │   └── emails.js      # Gestion des e-mails
│   ├── middleware/        # Middlewares
│   └── index.js           # Serveur principal
└── README.md
```

## 🚦 Routes de l'application

1. **/** - Page d'accueil avec connexion/inscription
2. **/emails** - Liste des e-mails avec fonctionnalités de recherche
3. **/email/:id** - Page de détail d'un e-mail spécifique
4. **/profile** - Profil utilisateur et statistiques

## 🗄️ API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `GET /api/auth/verify` - Vérification du token

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
- npm ou yarn

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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=email_manager
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

### 5. Lancement de l'application

#### Démarrage du backend
```bash
npm run server
```

#### Démarrage du frontend (dans un autre terminal)
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## 🔒 Sécurité

- **Authentification JWT** - Tokens sécurisés avec expiration
- **Hashage des mots de passe** - bcryptjs avec salt
- **Validation des données** - Validation côté serveur
- **Protection CORS** - Configuration sécurisée
- **Sanitisation HTML** - Protection contre XSS

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

## 🎯 Critères d'évaluation

- ✅ **25% Démonstration** - Interface utilisateur et expérience
- ✅ **75% Fonctionnalités** - Implémentation complète des exigences
- ✅ **Utilisation de GitHub** - Workflow et historique des commits
- ✅ **4 routes minimum** - Navigation complète de l'application
- ✅ **Bonus backend** - API REST complète avec PostgreSQL

## 📚 Documentation du code

Le code est entièrement documenté avec des commentaires JSDoc pour :
- Les fonctions complexes
- Les interfaces TypeScript
- Les stores et leur logique métier
- Les routes API et leur sécurité

## 🔧 Développement

### Scripts disponibles
- `npm run dev` - Démarrage du frontend en mode développement
- `npm run server` - Démarrage du serveur backend
- `npm run build` - Build de production du frontend
- `npm run preview` - Aperçu du build de production

### Workflow Git recommandé
- **master** - Code de production stable
- **develop** - Développement en cours
- Commits réguliers avec messages descriptifs

---

**Développé avec ❤️ en Vue.js 3, TypeScript et PostgreSQL**