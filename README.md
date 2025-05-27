# FamiLink - Plateforme de Gazette Familiale

FamiLink est une plateforme numérique destinée à renforcer les liens familiaux intergénérationnels. Elle permet à des membres d'une même famille, souvent éloignés géographiquement, de partager des moments de vie sous forme d'une gazette mensuelle.

## Architecture

Le projet utilise une architecture moderne basée sur :

- **Frontend**: Next.js 14 avec App Router et TypeScript
- **Backend**: NestJS avec TypeScript
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentication**: AWS Cognito
- **Stockage**: AWS S3 pour les photos
- **Internationalisation**: Support pour l'anglais, l'hébreu et le français

## Structure du Projet

```
familink/
├── frontend/                 # Application Next.js
├── backend/                  # API NestJS
├── shared/                   # Types TypeScript partagés
├── infrastructure/           # Scripts AWS
└── docs/                     # Documentation
```

## Phase de Développement Actuelle

**Phase 1 : Infrastructure et Authentication - TERMINÉE**

✅ Configuration de l'environnement de développement
✅ Mise en place de la structure Next.js + NestJS
✅ Configuration PostgreSQL avec Prisma
✅ Système d'authentification avec AWS Cognito
✅ Gestion des utilisateurs et des familles

**Phase 2 : Upload et Gestion des Photos - EN COURS**

- Upload de photos vers AWS S3
- Compression et optimisation des images
- Galerie photos pour chaque famille
- Sélection des photos pour la gazette

## Installation et Configuration

### Prérequis

- Node.js (v20 ou supérieur)
- PostgreSQL
- Compte AWS (pour Cognito et S3)

### Configuration du Frontend

```bash
cd frontend
npm install
# Créer un fichier .env.local avec les variables nécessaires
npm run dev
```

### Configuration du Backend

```bash
cd backend
npm install
# Créer un fichier .env avec les variables nécessaires
npx prisma migrate dev
npm run start:dev
```

## Variables d'Environnement

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AWS_REGION=eu-central-1
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
```

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/familink
AWS_REGION=eu-central-1
AWS_COGNITO_USER_POOL_ID=eu-central-1_xxxxxxxx
AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
AWS_COGNITO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
PORT=3001
JWT_SECRET=your-secret-key
```
