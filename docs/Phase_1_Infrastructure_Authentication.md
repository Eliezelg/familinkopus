# Phase 1 : Infrastructure et Authentication

## Vue d'ensemble
**Durée estimée** : 1 semaine  
**Objectif** : Mettre en place l'infrastructure de base et le système d'authentification complet

## Objectifs de la phase

1. **Infrastructure**
   - Configuration de l'environnement de développement
   - Mise en place de la structure Next.js + NestJS
   - Configuration PostgreSQL avec Prisma
   - Configuration AWS (Cognito, S3, RDS)

2. **Authentication**
   - Intégration AWS Cognito
   - Login/Register avec email
   - Login avec Google OAuth
   - Gestion des sessions
   - Pages d'authentification

3. **Base de données**
   - Configuration Prisma
   - Migration initiale avec les modèles User, Family, FamilyMember
   - Seeds de test

## Structure des dossiers à créer

```
familink/
├── frontend/                 # Application Next.js
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/    # Support i18n
│   │   │       ├── auth/
│   │   │       │   ├── login/
│   │   │       │   ├── register/
│   │   │       │   └── forgot-password/
│   │   │       └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/         # Composants shadcn/ui
│   │   │   └── auth/       # Composants d'auth
│   │   ├── lib/
│   │   │   ├── auth/       # Logique Cognito
│   │   │   └── utils/      # Utilitaires
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # Types TypeScript
│   │   └── styles/         # Styles globaux
│   ├── public/
│   │   └── locales/        # Fichiers de traduction
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── auth/           # Module authentication
│   │   ├── users/          # Module users
│   │   ├── families/       # Module families
│   │   ├── common/         # Code partagé
│   │   ├── config/         # Configuration
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma existant
│   │   └── migrations/     # Migrations Prisma
│   ├── nest-cli.json
│   └── package.json
│
├── shared/                   # Types partagés
│   └── types/
│       ├── auth.ts
│       ├── user.ts
│       └── family.ts
│
└── infrastructure/          # Scripts AWS
    └── aws/
        ├── cognito.tf
        ├── s3.tf
        └── rds.tf
```

## Tâches détaillées

### 1. Configuration initiale (Jour 1)

#### Frontend (Next.js)
- [ ] Initialiser projet Next.js 14 avec App Router
- [ ] Configurer TypeScript strict
- [ ] Installer et configurer Tailwind CSS
- [ ] Installer shadcn/ui
- [ ] Configurer next-intl pour i18n (EN/HE)
- [ ] Configurer variables d'environnement

#### Backend (NestJS)
- [ ] Initialiser projet NestJS
- [ ] Configurer TypeScript
- [ ] Installer et configurer Prisma
- [ ] Configurer CORS et sécurité
- [ ] Configurer variables d'environnement

#### Base de données
- [ ] Créer base PostgreSQL locale
- [ ] Appliquer schéma Prisma existant
- [ ] Créer première migration
- [ ] Créer seeds de test

### 2. AWS Cognito Integration (Jour 2-3)

#### Infrastructure AWS
- [ ] Créer User Pool Cognito
- [ ] Configurer attributs utilisateur (email, firstName, lastName)
- [ ] Configurer Google OAuth
- [ ] Créer App Client
- [ ] Configurer domaine Cognito

#### Backend - Module Auth
```typescript
// auth/auth.module.ts
- AuthController
- AuthService
- CognitoService
- JWT Strategy
- Guards (JWT, Roles)
```

- [ ] Endpoints:
  - POST /auth/register
  - POST /auth/login
  - POST /auth/logout
  - POST /auth/refresh
  - POST /auth/forgot-password
  - POST /auth/reset-password
  - GET /auth/me

### 3. Frontend Authentication (Jour 3-4)

#### Composants UI
- [ ] LoginForm avec validation
- [ ] RegisterForm avec validation
- [ ] ForgotPasswordForm
- [ ] GoogleSignInButton
- [ ] AuthLayout

#### Pages
- [ ] /auth/login
- [ ] /auth/register
- [ ] /auth/forgot-password
- [ ] /auth/reset-password

#### Hooks et Context
- [ ] useAuth hook
- [ ] AuthContext provider
- [ ] Protected route wrapper

### 4. User Management (Jour 4-5)

#### Backend - Module Users
```typescript
// users/users.module.ts
- UsersController
- UsersService
- User DTOs
```

- [ ] Endpoints:
  - GET /users/profile
  - PATCH /users/profile
  - POST /users/upload-avatar
  - GET /users/children
  - POST /users/children
  - PATCH /users/children/:id
  - DELETE /users/children/:id

#### Frontend
- [ ] Profile page
- [ ] Edit profile form
- [ ] Children management
- [ ] Avatar upload

### 5. Family Creation (Jour 5-6)

#### Backend - Module Families
```typescript
// families/families.module.ts
- FamiliesController
- FamiliesService
- Family DTOs
```

- [ ] Endpoints:
  - POST /families (create family)
  - GET /families (list user's families)
  - GET /families/:id
  - PATCH /families/:id
  - DELETE /families/:id

#### Frontend
- [ ] Create family form
- [ ] Family dashboard (basique)
- [ ] Switch family selector

### 6. Tests et Documentation (Jour 6-7)

#### Tests
- [ ] Tests unitaires services auth
- [ ] Tests e2e authentication flow
- [ ] Tests frontend composants auth

#### Documentation
- [ ] API documentation (Swagger)
- [ ] README avec instructions setup
- [ ] Documentation architecture

## Dépendances à installer

### Frontend
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@aws-amplify/auth": "latest",
    "@aws-amplify/ui-react": "latest",
    "next-intl": "latest",
    "@tanstack/react-query": "latest",
    "axios": "latest",
    "react-hook-form": "latest",
    "zod": "latest",
    "@hookform/resolvers": "latest",
    "zustand": "latest"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/node": "latest",
    "typescript": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "@types/react-dom": "latest"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "@nestjs/common": "latest",
    "@nestjs/core": "latest",
    "@nestjs/platform-express": "latest",
    "@nestjs/config": "latest",
    "@nestjs/jwt": "latest",
    "@nestjs/passport": "latest",
    "@prisma/client": "latest",
    "aws-sdk": "latest",
    "amazon-cognito-identity-js": "latest",
    "passport": "latest",
    "passport-jwt": "latest",
    "class-validator": "latest",
    "class-transformer": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest",
    "prisma": "latest",
    "@types/passport-jwt": "latest"
  }
}
```

## Critères de validation

- [ ] User peut s'inscrire avec email/password
- [ ] User peut se connecter avec email/password
- [ ] User peut se connecter avec Google
- [ ] User reçoit email de confirmation
- [ ] User peut réinitialiser mot de passe
- [ ] User peut voir et éditer son profil
- [ ] User peut créer une famille
- [ ] User peut ajouter ses enfants
- [ ] JWT tokens fonctionnent correctement
- [ ] Protection des routes fonctionne
- [ ] Support EN/HE fonctionne

## Notes importantes

1. **Sécurité** : Toutes les routes API doivent être protégées sauf login/register
2. **Validation** : Utiliser Zod côté frontend et class-validator côté backend
3. **Erreurs** : Gestion d'erreurs complète avec messages traduits
4. **Performance** : Lazy loading des pages, optimisation des bundles
5. **Accessibilité** : Formulaires accessibles avec labels appropriés

## Prochaine phase

Phase 2 : Upload et gestion des photos
- Upload vers S3
- Compression et optimisation
- Galerie photos
- Sélection pour gazette
