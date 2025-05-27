# Architecture Technique FamiLink MVP

## Structure des Projets

```
familink/
├── frontend/              # Next.js Application
├── backend/               # NestJS API
├── shared/                # Types TypeScript partagés
├── infrastructure/        # Scripts AWS CDK/Terraform
└── docs/                  # Documentation

```

## Frontend - Next.js

### Structure des Dossiers
```
frontend/
├── src/
│   ├── app/              # App Router Next.js 14
│   │   ├── [locale]/     # Routes i18n
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── family/
│   │   │   ├── gazette/
│   │   │   └── payment/
│   ├── components/
│   │   ├── ui/           # Composants réutilisables
│   │   ├── auth/
│   │   ├── family/
│   │   ├── photos/
│   │   └── gazette/
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilitaires
│   ├── services/         # API calls
│   ├── store/            # Zustand stores
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── public/
│   └── locales/          # Traductions
├── next.config.js
└── package.json
```

### Composants Clés MVP

```typescript
// components/photos/PhotoUploader.tsx
interface PhotoUploaderProps {
  familyId: string;
  onUploadComplete: (photos: Photo[]) => void;
  maxPhotos?: number;
}

// components/gazette/GazettePreview.tsx
interface GazettePreviewProps {
  photos: Photo[];
  familyName: string;
  month: string;
}

// components/family/MemberInvite.tsx
interface MemberInviteProps {
  familyId: string;
  onInvitesSent: () => void;
}
```

## Backend - NestJS

### Structure des Modules
```
backend/
├── src/
│   ├── auth/             # Cognito integration
│   ├── users/            # User management
│   ├── families/         # Family CRUD
│   ├── photos/           # Photo upload/management
│   ├── gazette/          # PDF generation
│   ├── payment/          # Zcredit integration
│   ├── mail/             # Email service
│   ├── common/           # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── pipes/
│   └── config/           # Configuration
├── test/
└── package.json
```

### Modèles de Données (PostgreSQL)

```typescript
// User Entity
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: ['en', 'he'], default: 'en' })
  language: string;

  @Column({ nullable: true })
  cognitoId: string;

  @OneToMany(() => FamilyMember, member => member.user)
  familyMemberships: FamilyMember[];

  @CreateDateColumn()
  createdAt: Date;
}

// Family Entity
@Entity()
export class Family {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'simple-json', nullable: true })
  settings: {
    language: 'en' | 'he';
    gazetteDay: number; // 1-28
  };

  @OneToMany(() => FamilyMember, member => member.family)
  members: FamilyMember[];

  @OneToMany(() => Photo, photo => photo.family)
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;
}

// Photo Entity
@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  s3Key: string;

  @Column()
  originalUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column({ nullable: true })
  caption: string;

  @ManyToOne(() => User)
  uploadedBy: User;

  @ManyToOne(() => Family)
  family: Family;

  @Column({ default: false })
  selectedForGazette: boolean;

  @Column({ nullable: true })
  gazetteOrder: number;

  @CreateDateColumn()
  uploadedAt: Date;
}

// Subscription Entity
@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Family)
  family: Family;

  @Column({ type: 'enum', enum: ['active', 'cancelled', 'past_due'] })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column({ nullable: true })
  promoCode: string;

  @Column({ nullable: true })
  zcreditCustomerId: string;

  @CreateDateColumn()
  startDate: Date;
}
```

## Services Clés

### Service Upload Photo
```typescript
@Injectable()
export class PhotoService {
  constructor(
    private s3Service: S3Service,
    private photoRepository: PhotoRepository,
  ) {}

  async uploadPhoto(
    file: Express.Multer.File,
    userId: string,
    familyId: string,
    caption?: string,
  ): Promise<Photo> {
    // 1. Validate file
    // 2. Compress image
    // 3. Upload to S3
    // 4. Create thumbnail
    // 5. Save to database
  }
}
```

### Service Génération Gazette
```typescript
@Injectable()
export class GazetteService {
  async generateGazette(familyId: string): Promise<Buffer> {
    // 1. Get selected photos (max 28)
    // 2. Load template HTML
    // 3. Inject photos and captions
    // 4. Generate PDF with Puppeteer
    // 5. Return PDF buffer
  }

  async scheduleMonthlyGazettes(): Promise<void> {
    // Cron job to generate gazettes
  }
}
```

## Configuration Environnement

### .env.local (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AWS_REGION=il-central-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=xxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxx
```

### .env (Backend)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/familink

# AWS
AWS_REGION=il-central-1
AWS_S3_BUCKET=familink-photos
AWS_COGNITO_USER_POOL_ID=xxx
AWS_COGNITO_CLIENT_ID=xxx

# Zcredit
ZCREDIT_API_KEY=xxx
ZCREDIT_TERMINAL_ID=xxx

# App
JWT_SECRET=xxx
FRONTEND_URL=http://localhost:3000
```

## Scripts de Démarrage

### Package.json Frontend
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Package.json Backend
```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main",
    "migration:generate": "typeorm migration:generate",
    "migration:run": "typeorm migration:run"
  }
}
```

## Commandes de Démarrage Rapide

```bash
# 1. Cloner et installer
git clone https://github.com/your-org/familink.git
cd familink

# 2. Backend
cd backend
npm install
npm run migration:run
npm run dev

# 3. Frontend (nouveau terminal)
cd ../frontend
npm install
npm run dev

# 4. Accéder à l'app
# http://localhost:3000
```

## Points d'Attention MVP

1. **RTL pour l'hébreu**: Utiliser `dir="rtl"` et classes Tailwind RTL
2. **Compression photos**: Côté client avec canvas avant upload
3. **PDF hébreu**: Police spécifique dans Puppeteer
4. **Timezone**: Toujours Israel (UTC+2/+3)
5. **Mobile first**: Tester sur mobile dès le début

Cette architecture permet de démarrer rapidement tout en restant évolutif pour les phases suivantes.
