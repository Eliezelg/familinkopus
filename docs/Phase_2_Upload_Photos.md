# Phase 2 : Upload et Gestion des Photos

## Vue d'ensemble
**Durée estimée** : 1 semaine  
**Objectif** : Mettre en place le système d'upload de photos vers S3 et la gestion des galeries par famille

## Objectifs de la phase

1. **Upload de photos**
   - Configuration AWS S3
   - Interface d'upload (drag & drop)
   - Optimisation côté serveur
   - Gestion des métadonnées

2. **Gestion des galeries**
   - Affichage des photos par famille
   - Tri et filtrage
   - Ajout/modification des légendes
   - Sélection pour la gazette

3. **Optimisation**
   - Compression d'images
   - Génération de vignettes
   - Système de files d'attente pour les traitements asynchrones

## Tâches détaillées

### 1. Configuration AWS S3 (Jour 1)

#### Backend
- [ ] Créer bucket S3 dédié
- [ ] Configurer les politiques d'accès
- [ ] Service S3 pour gestion des fichiers
- [ ] Middleware de validation (format, taille)

```typescript
// Exemple de service S3
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadFile(file: Buffer, mimetype: string, familyId: string, userId: string): Promise<string> {
    const key = `families/${familyId}/photos/${uuid()}.${mimetype.split('/')[1]}`;
    
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: mimetype,
        Metadata: {
          userId,
          familyId,
          uploadDate: new Date().toISOString(),
        },
      }),
    );

    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }
}
```

#### Frontend
- [ ] Configuration variables d'environnement
- [ ] Client API pour communiquer avec S3

### 2. Upload de photos (Jour 2-3)

#### Backend
- [ ] Contrôleur pour gestion des uploads
- [ ] Service de validation et stockage des métadonnées
- [ ] Service d'optimisation d'images (compression, redimensionnement)
- [ ] Gestion des quotas par famille

```typescript
// photos.controller.ts
@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('familyId') familyId: string,
    @Body('caption') caption?: string,
  ) {
    // Vérifier l'appartenance à la famille
    await this.photosService.checkFamilyMembership(req.user.sub, familyId);
    
    // Vérifier le quota
    await this.photosService.checkQuota(familyId);
    
    // Upload sur S3
    const s3Key = await this.s3Service.uploadFile(
      file.buffer,
      file.mimetype,
      familyId,
      req.user.sub,
    );
    
    // Optimiser l'image (compression, vignettes)
    const { originalUrl, thumbnailUrl, width, height, sizeInBytes } = 
      await this.photosService.optimizeImage(s3Key, file.buffer);
    
    // Enregistrer en base de données
    const photo = await this.photosService.createPhoto({
      originalUrl,
      thumbnailUrl,
      s3Key,
      caption,
      familyId,
      uploadedById: req.user.sub,
      mimeType: file.mimetype,
      width,
      height,
      sizeInBytes,
    });
    
    return photo;
  }
}
```

#### Frontend
- [ ] Composant d'upload drag & drop
- [ ] Gestion de la progression
- [ ] Prévisualisation
- [ ] Validation côté client

```tsx
// PhotoUploader.tsx
export const PhotoUploader = ({ familyId }: { familyId: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    // Validation de type et taille
    const validFiles = acceptedFiles.filter(
      file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length !== acceptedFiles.length) {
      setError('Certains fichiers ont été rejetés (format ou taille)');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);
  
  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('familyId', familyId);
        
        await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });
        
        setProgress(((i + 1) / files.length) * 100);
      }
      
      setFiles([]);
    } catch (err) {
      setError('Erreur lors de l\'upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
      {/* UI components */}
    </div>
  );
};
```

### 3. Galerie photos (Jour 4-5)

#### Backend
- [ ] API pour récupérer les photos par famille
- [ ] Filtrage et pagination
- [ ] Endpoint pour mise à jour des légendes
- [ ] Gestion des sélections pour la gazette

#### Frontend
- [ ] Composant galerie avec grid/masonry layout
- [ ] Système de filtres (date, membre, etc.)
- [ ] Modal de visualisation détaillée
- [ ] Interface d'édition des légendes

```tsx
// PhotoGallery.tsx
export const PhotoGallery = ({ familyId }: { familyId: string }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/photos?familyId=${familyId}&page=${page}`);
        const data = await response.json();
        
        setPhotos(prev => (page === 1 ? data.photos : [...prev, ...data.photos]));
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Erreur lors du chargement des photos', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [familyId, page]);
  
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div 
            key={photo.id}
            className="relative cursor-pointer"
            onClick={() => setActivePhoto(photo)}
          >
            <img 
              src={photo.thumbnailUrl} 
              alt={photo.caption || 'Photo de famille'}
              className="w-full h-48 object-cover rounded-lg"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white text-sm truncate">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {loading && <p className="text-center mt-4">Chargement...</p>}
      
      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Charger plus
        </button>
      )}
      
      {activePhoto && (
        <PhotoModal 
          photo={activePhoto} 
          onClose={() => setActivePhoto(null)}
          onUpdateCaption={(newCaption) => {
            // Mettre à jour la légende
          }}
          onToggleSelection={(selected) => {
            // Sélectionner/désélectionner pour la gazette
          }}
        />
      )}
    </div>
  );
};
```

### 4. Optimisation des images (Jour 6-7)

#### Backend
- [ ] Service de traitement d'images (Sharp)
- [ ] Génération de différentes tailles (original, thumbnail, etc.)
- [ ] File d'attente pour traitement asynchrone (Bull)
- [ ] Stockage des métadonnées (EXIF)

```typescript
// ImageProcessingService
@Injectable()
export class ImageProcessingService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectQueue('image-processing') private imageQueue: Queue,
  ) {}

  async optimizeImage(file: Buffer, mimeType: string, s3Key: string): Promise<void> {
    // Ajouter à la file d'attente pour traitement asynchrone
    await this.imageQueue.add('optimize', {
      s3Key,
      mimeType,
    });
  }

  async processImage(s3Key: string, mimeType: string): Promise<ImageMetadata> {
    // Récupérer l'image depuis S3
    const s3Object = await this.s3Service.getObject(s3Key);
    
    // Extraire les métadonnées EXIF
    const metadata = await sharp(s3Object.Body).metadata();
    
    // Générer les versions redimensionnées
    const thumbnail = await sharp(s3Object.Body)
      .resize(300, 300, { fit: 'inside' })
      .toBuffer();
    
    const medium = await sharp(s3Object.Body)
      .resize(800, 800, { fit: 'inside' })
      .toBuffer();
    
    // Optimiser l'original (compression)
    const optimized = await sharp(s3Object.Body)
      .jpeg({ quality: 85 })
      .toBuffer();
    
    // Uploader les nouvelles versions
    const thumbnailKey = s3Key.replace(/\.[^.]+$/, '_thumbnail.jpg');
    const mediumKey = s3Key.replace(/\.[^.]+$/, '_medium.jpg');
    const optimizedKey = s3Key.replace(/\.[^.]+$/, '_optimized.jpg');
    
    await Promise.all([
      this.s3Service.uploadFile(thumbnail, 'image/jpeg', thumbnailKey),
      this.s3Service.uploadFile(medium, 'image/jpeg', mediumKey),
      this.s3Service.uploadFile(optimized, 'image/jpeg', optimizedKey),
    ]);
    
    return {
      width: metadata.width,
      height: metadata.height,
      originalKey: s3Key,
      thumbnailKey,
      mediumKey,
      optimizedKey,
      exif: metadata.exif,
    };
  }
}
```

#### Frontend
- [ ] Gestion du lazy loading
- [ ] Affichage adaptatif selon la taille d'écran
- [ ] Gestion du cache
- [ ] Optimisation des performances

### 5. Tests et Documentation (Jour 7)

- [ ] Tests unitaires des services
- [ ] Tests d'intégration
- [ ] Documentation des API
- [ ] Guide utilisateur pour l'upload et la gestion des photos

## Dépendances à installer

### Backend
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner sharp multer @nestjs/bull bull
```

### Frontend
```bash
npm install react-dropzone react-masonry-css
```

## Critères de validation

- [ ] Upload de photos fonctionnel
- [ ] Galerie photos avec pagination
- [ ] Optimisation des images (compression, redimensionnement)
- [ ] Édition des légendes
- [ ] Sélection pour la gazette
- [ ] Respect des quotas par famille
- [ ] Interface responsive

## Prochaine phase

Phase 3 : Génération de Gazette
- Création du template de gazette
- Génération PDF
- Prévisualisation
- Réorganisation des photos sélectionnées
