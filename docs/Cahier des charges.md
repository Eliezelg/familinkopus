# Cahier des Charges Complet – Plateforme FamiLink (Architecture Next.js + NestJS + AWS)

## 1. Présentation du Projet

### 1.1 Contexte

FamiLink est une plateforme numérique destinée à renforcer les liens familiaux intergénérationnels. Elle permet à des membres d'une même famille, souvent éloignés géographiquement, de partager des moments de vie sous forme d'une gazette mensuelle, imprimée et envoyée aux personnes âgées du cercle familial, tout en conservant une version numérique accessible à tous les membres.

### 1.2 Objectifs

- Faciliter la communication entre les générations
- Réduire l'isolement des aînés
- Créer une mémoire familiale imprimée et numérique pérenne
- Offrir une expérience numérique multilingue et intuitive
- Assurer la confidentialité des données partagées
- Offrir des outils de contribution simples pour tous les âges
- Garantir l'accessibilité à tous types d'utilisateurs, incluant les personnes en situation de handicap

### 1.3 Public Cible

- Familles multigénérationnelles
- Personnes âgées non connectées (destinataires papier)
- Parents et petits-enfants souhaitant partager
- Familles multiculturelles et internationales
- Utilisateurs avec différents niveaux d'alphabétisation numérique
- Personnes en situation de handicap

### 1.4 Analyse Compétitive

| Concurrent | Forces | Faiblesses | Différenciation FamiLink |
|------------|--------|------------|--------------------------|
| Album photo familial en ligne | Interface simple, partage facile | Absence de version papier, pas de focus intergénérationnel | Version papier dédiée aux seniors + expérience numérique |
| Réseaux sociaux familiaux | Grande base d'utilisateurs, fonctions sociales | Manque d'intimité, publicités intrusives | Confidentialité totale, pas de publicité, gazette physique |
| Services d'impression photo | Qualité d'impression élevée | Pas de plateforme numérique associée | Solution hybride numérique/papier avec curation automatique |
| Applications de messagerie | Accessibilité, instantanéité | Pas de mémoire structurée, pas d'option papier | Construction d'une mémoire familiale organisée, gazette mensuelle |

## 2. Fonctionnalités Générales

### 2.1 Création et Gestion de Famille

- Création de "familles numériques" avec un administrateur
- Système d'invitation des membres (email, lien personnalisé, QR code)
- Attribution de rôles : admin, contributeur
- Possibilité d'appartenir à plusieurs familles


### 2.2 Gestion des Profils

- Informations personnelles (nom, photo, langue, date de naissance)
- Gestion des enfants (nom, photo, date de naissance) chaque utilisateur peux enregistrer la liste de ses enfants
- Préférences de notification, langue et confidentialité
- Options d'accessibilité personnalisables (taille de texte, contraste, synthèse vocale)
- Gestion des consentements RGPD détaillée et transparente
- Portefeuille numérique pour les paiements et crédits
- Paramètres de confidentialité granulaires

### 2.3 Partage de Contenu

- Upload de photos (JPEG, PNG, HEIC, WebP) avec compression intelligente
- Légendes, auteur, date automatique, localisation optionnelle
- Ajout de textes courts (500 caractères) avec formatage basique
- Import automatique via email dédié
- Intégration avec services tiers (Google Photos, Apple Photos, Instagram, Facebook)
- Système de signalement de contenu par les membres
- Fonctionnalité d'édition d'image basique (recadrage, filtre, correction automatique)
- Reconnaissance faciale opt-in pour l'organisation des albums
- Mode hors ligne pour création et consultation ultérieure

### 2.4 Système de Gazette

- Génération automatique mensuelle d'une gazette PDF
- Mise en page dynamique : couverture, anniversaires, contenus
- Choix de modèles personnalisables, thèmes saisonniers et événementiels
- Impression et envoi postal des gazettes aux destinataires âgés
- Version numérique consultable et partageable
- Possibilité d'ajouter des pages spéciales (événements familiaux importants)
- Archivage intelligent avec tags et recherche par texte/date/événement

### 2.5 Gestion des Destinataires Papier

- Carnet d'adresses avec vérification et normalisation
- Périodes temporaires (vacances, hospitalisation)
- Gestion des retours et problèmes de livraison
- Options d'expédition (standard, prioritaire, express)
- Historique des envois avec statuts détaillés

### 2.6 Système de Cagnotte et Paiement

- Cagnotte familiale partagée avec transparence des contributions
- Paiement prioritaire via cagnotte, fallback CB
- Historique des transactions et reçus électroniques
- Intégration Stripe (global) + ZCredit (Israël)
- Gestion multi-devises avec conversion automatique
- Système de codes promo, parrainage et récompenses de fidélité
- Options de facturation récurrente (abonnement mensuel, trimestriel, annuel)
- Partage équitable des coûts entre membres (suggestions automatiques)
- Tableau de bord financier avec prévisions de dépenses
- Export des données financières pour comptabilité

### 2.7 Notifications et Rappels

- Rappels de contribution avant deadline mensuelle (paramétrable)
- Alertes de solde bas avec suggestions de réapprovisionnement
- Notifications de statut de gazette (génération, validation, impression, expédition)
- Badges pour contribution régulière et gamification
- Centre de notifications personnalisable avec priorités
- Options de communication multicanal (email, SMS, push mobile, WhatsApp)
- Digest hebdomadaire des activités familiales
- Rappels d'événements importants (anniversaires, fêtes)

### 2.8 Multilinguisme et Calendriers

- Interface traduite en 8 langues (dont hébreu et arabe avec RTL)
- Traduction automatique de contenus avec option de révision humaine
- Prise en charge des calendriers : grégorien, hébraïque, musulman, chinois
- Rappels automatiques selon calendrier choisi
- Reconnaissance des fêtes nationales et religieuses par pays/culture
- Suggestions de contenu basées sur les événements calendaires
- Support complet Unicode pour caractères spéciaux et alphabets non-latins

### 2.9 Espace Personnel et Tableau de Bord

- Statistiques de contribution avec visualisations
- Accès aux gazettes archivées (PDF, versions numériques interactives)
- Paramètres personnels avec préférences avancées
- Vue famille avec contributions de tous les membres
- Timeline d'activité personnelle et familiale
- Recommandations personnalisées de contenu à partager
- Outils de recherche avancée dans l'historique familial

## 3. Expérience Utilisateur

### 3.1 Parcours Utilisateurs

#### 3.1.1 Onboarding
- Parcours simplifié pour les seniors avec tutoriel adapté
- Processus d'invitation avec contexte familial
- Tour guidé interactif des fonctionnalités principales
- Completion progressive du profil avec indicateurs d'avancement

#### 3.1.2 Contribution Quotidienne
- Accès rapide à l'upload de photos depuis l'écran d'accueil
- Suggestions contextuelles de partage (anniversaires, événements)
- Rappels non-intrusifs avant clôture de la gazette

#### 3.1.3 Administration Familiale
- Tableau de bord synthétique pour administrateurs
- Outils de modération simplifiés
- Système d'approbation en un clic

#### 3.1.4 Utilisateurs Seniors
- Interface épurée avec grands boutons
- Mode lecture simplifiée
- Support pour lecteurs d'écran

### 3.2 Design et Ergonomie

- Design responsive pour tous appareils (desktop, tablette, mobile)
- Interface adaptative selon les préférences utilisateur
- Thèmes clairs/sombres et personnalisables
- Navigation intuitive avec architecture d'information hiérarchique
- Composants accessibles conformes WCAG 2.1 AA
- Charte graphique cohérente avec palette émotionnelle familiale

### 3.3 Accessibilité

- Conformité WCAG 2.1 niveau AA minimum
- Support complet pour lecteurs d'écran (ARIA)
- Navigation clavier optimisée
- Test régulier avec utilisateurs en situation de handicap
- Documentation d'accessibilité publique et transparente
- Adaptation aux daltoniens et malvoyants (contraste, taille, police)

### 3.4 Versions et Compatibilité

#### 3.4.1 Version Web
- Progressive Web App (PWA) avec fonctionnalités hors ligne
- Compatible avec navigateurs modernes (2 dernières versions)
- Optimisée pour connexions bas débit

#### 3.4.2 Application Mobile
- Applications natives iOS et Android avec expo go
- Synchronisation transparente entre appareils
- Notifications push personnalisées
- Accès appareil photo et galerie optimisé

## 4. Architecture Technique

### 4.1 Vue d'Ensemble

### 4.2 Frontend – Next.js

- SEO-friendly avec SSR/SSG/ISR
- Multilingue intégré (i18n routing)
- Auth Cognito intégrée
- Connexion API REST sécurisée avec JWT
- State management avec Redux Toolkit / React Query
- Composants UI atomiques avec Storybook
- Déploiement sur Vercel, Amplify, ou S3 + CloudFront
- Tests E2E avec Cypress et tests unitaires Jest
- Optimisation des images avec next/image
- PWA capabilities avec workbox
- Analytics côté client anonymisées (Plausible/Matomo)

### 4.3 Backend – NestJS

- Auth via Cognito, vérification JWT, rôles granulaires
- ORM Prisma (PostgreSQL via RDS)
- Upload vers S3 via presigned URL
- Génération de PDF via ?
- API REST documentée avec Swagger/OpenAPI
- Validation des données et sanitization
- Rate limiting et protection DDOS
- Logs structurés et monitoring
- Modules :
  - Auth
  - Familles
  - Contenus
  - Cagnotte
  - Gazette
  - Paiement
  - Notifications
  - Modération
  - Analytics
  - Administration
- Déploiement sur AWS Elastic Beanstalk ou ECS 

### 4.4 Services AWS Mobilisés

| Fonction | AWS Service | Alternative |
|----------|------------|------------|
| Authentification | Amazon Cognito | Auth0 |
| Stockage fichiers | Amazon S3 | Google Cloud Storage |
| Distribution contenu | Amazon CloudFront | Cloudflare |
| Base de données | Amazon RDS (PostgreSQL) | Cloud SQL |
| Cache / Files d'attente | ElastiCache Redis + SQS | Redis Labs |
| Emails | Amazon SES | SendGrid |
| Monitoring | CloudWatch | Datadog |
| Sécurité | AWS WAF + IAM | Cloudflare |
| Certificats HTTPS | AWS ACM | Let's Encrypt |
| CI/CD | CodePipeline / GitHub Actions | CircleCI |
| Serverless Functions | AWS Lambda | Vercel Functions |
| Analyses | AWS Athena | BigQuery |

### 4.5 Scalabilité et Performance

- Architecture à charge équilibrée avec auto-scaling
- Stratégie de cache à plusieurs niveaux (browser, CDN, application, database)
- Optimisation des images avec redimensionnement à la demande
- Lazy loading des contenus
- Mise en place d'index de recherche efficaces
- Sharding de base de données pour scaling horizontal
- Séparation lecture/écriture pour optimisation de base de données
- Tests de charge automatisés dans le pipeline CI/CD
- Métriques de performance temps réel

### 4.6 Stratégie de Stockage et Données

- Hiérarchisation des données (hot/warm/cold)
- Optimisation des requêtes avec monitoring
- Archivage automatique des données anciennes vers stockage froid
- Dénormalisation stratégique pour requêtes fréquentes
- Backup multi-régions avec réplication cross-AZ
- Stratégie de rétention et purge conforme RGPD

## 5. Sécurité & RGPD

### 5.1 Authentification et Autorisation

- Authentification multi-facteur (MFA)
- Gestion de sessions sécurisée avec JWT et refresh tokens
- SSO avec providers sociaux et enterprise (optionnel)
- Politique de mot de passe robuste avec détection des compromissions
- Connexion contextuelle avec détection d'anomalies
- Gestion fine des permissions avec RBAC

### 5.2 Protection des Données

- Chiffrement des données sensibles at-rest et in-transit
- Tokenisation des données de paiement
- Pseudonymisation des données personnelles où possible
- Minimisation des données collectées
- Anonymisation complète des données d'analyse
- Gestion du cycle de vie des données avec purge automatique

### 5.3 Conformité Réglementaire

- RGPD/GDPR (Europe)
- CCPA/CPRA (Californie)
- LGPD (Brésil)
- Documentation conforme aux obligations légales
- Registre des traitements constamment maintenu
- PIA (Privacy Impact Assessment) documenté
- Procédures d'exercice des droits (accès, rectification, suppression)

### 5.4 Sécurité Opérationnelle

- HSTS et en-têtes de sécurité optimisés
- Protection contre injections (SQL, XSS, CSRF)
- Scan de vulnérabilités automatique dans CI/CD
- Pentests réguliers par tiers indépendant
- Bug bounty program (phase 3)
- Gestion des incidents et plan de réponse documenté

### 5.5 Sauvegarde et Continuité

- Stratégie de backup 3-2-1 (3 copies, 2 supports différents, 1 hors-site)
- RPO (Recovery Point Objective) : 15 minutes
- RTO (Recovery Time Objective) : 4 heures
- Tests de restauration réguliers
- Plan de reprise d'activité documenté et testé
- Failover automatique entre régions AWS

## 6. Tests et Qualité

### 6.1 Stratégie de Test

- Tests unitaires (Jest – backend, Vitest – frontend)
- Tests d'intégration (Cypress)
- Tests d'accessibilité (Lighthouse, axe)
- Tests de performance (Artillery, K6)
- Tests de sécurité automatisés (OWASP ZAP)
- Tests de charge et stress (Locust)
- Tests A/B pour fonctionnalités critiques d'UX
- Tests utilisateurs avec panels représentatifs

### 6.2 Assurance Qualité

- CI automatisé avec tests avant déploiement
- Couverture de code minimale obligatoire (80%)
- Revue de code systématique
- Revue de sécurité pour modifications sensibles
- Environnements de dev/staging/production
- Monitoring de qualité en temps réel
- Rapports de régression automatisés

### 6.3 Mesures de Performance

- Score Lighthouse minimal de 90+ sur toutes les catégories
- Temps de chargement initial < 2s (P95)
- TTI (Time to Interactive) < 3.5s
- First Input Delay < 100ms
- Cumulative Layout Shift < 0.1

## 7. Gestion de Projet

### 7.1 Méthodologie

- Développement Agile (Scrum) avec sprints de 2 semaines
- Backlog produit maintenu et priorisé
- Réunions bihebdomadaires d'avancement
- Démos régulières avec stakeholders
- Revues rétrospectives d'amélioration continue

### 7.2 Équipe et Rôles

| Rôle | Responsabilités |
|------|----------------|
| Product Owner | Vision produit, priorisation backlog |
| Scrum Master | Animation méthodologie, élimination obstacles |
| Tech Lead | Architecture technique, standards de code |
| Développeurs Frontend | Implémentation interface utilisateur |
| Développeurs Backend | Développement API et services |
| DevOps | Infrastructure, déploiement, monitoring |
| Designer UX/UI | Expérience utilisateur, maquettes, tests |
| QA Engineer | Stratégie de test, automatisation |
| Security Officer | Conformité sécurité, audits |
| Customer Success | Support utilisateur, documentation |

### 7.3 Matrice RACI

| Activité | Product Owner | Tech Lead | Dev Team | QA | DevOps | Design | Security |
|----------|--------------|-----------|----------|----|---------|---------|---------| 
| Définition besoins | R | C | I | I | I | C | C |
| Architecture | I | R | C | C | A | I | C |
| Développement | I | A | R | C | C | C | C |
| Tests | C | C | C | R | A | I | C |
| Déploiement | I | C | C | C | R | I | A |
| Sécurité | I | C | C | C | C | I | R |
| UX/UI | A | I | C | C | I | R | I |

### 7.4 Plan de Déploiement

- Environnement de développement : PR preview automatiques
- Environnement de staging : Déploiement après merge sur main
- Environnement de production : Déploiement manuel après validation staging
- Canary releases pour fonctionnalités à risque
- Rollback automatisé en cas d'alerte critique
- Blue/Green deployment pour mises à jour sans interruption

### 7.5 Métriques et KPIs

#### 7.5.1 Métriques Produit
- Taux d'activation (% création de famille complète après inscription)
- Taux de contribution mensuelle (% membres actifs)
- Taux de satisfaction (NPS)
- Rétention à 3 mois / 6 mois / 12 mois
- Nombre moyen de membres par famille
- Nombre moyen de gazettes par famille

#### 7.5.2 Métriques Techniques
- Disponibilité (uptime)
- Temps de réponse API (p95, p99)
- Taux d'erreurs
- Temps de build/déploiement
- Couverture de tests

### 7.6 Analyse de Risques

| Risque | Impact | Probabilité | Stratégie de Mitigation |
|--------|--------|-------------|------------------------|
| Faible adoption seniors | Élevé | Moyen | Tests utilisateurs spécifiques, simplification extrême |
| Problèmes d'impression | Élevé | Faible | Multiples partenaires d'impression, tests qualité |
| Dépassement coûts AWS | Moyen | Moyen | Monitoring, alertes, optimisation, reserved instances |
| Fuite de données | Critique | Très faible | Audit sécurité, pen-testing, chiffrement |
| Performance insuffisante | Élevé | Faible | Tests charge, profiling, optimisation |
| Dette technique | Moyen | Moyen | Standards code, revues, sessions refactoring |

## 8. Modèle Économique et Marketing

### 8.1 Modèle Tarifaire

70 shekels par mois pour une gazette de 28 photos (2 par page).
Code promo pour faire passer le tarif à 50 shekels par mois à vie.

### 8.2 Stratégie d'Acquisition

- Marketing digital ciblé (Facebook, Instagram) avec focus sur persona "parent connecteur"
- Partenariats avec EHPAD et résidences seniors
- Programme de parrainage avec incitatifs pour l'invitant et l'invité
- Contenu SEO ciblé sur cohésion familiale, généalogie, mémoire familiale
- Relations publiques autour du lien intergénérationnel
- Présence sur événements familiaux et seniors

### 8.3 Stratégie de Rétention

- Gamification de la contribution (badges, niveaux, statistiques)
- Notifications intelligentes et non intrusives
- Contenus saisonniers et événementiels
- Suggestions personnalisées basées sur historique
- Programme de fidélité avec avantages croissants
- Support client réactif multi-canal

### 8.4 Prévisions Financières

#### 8.4.1 Projections Utilisateurs
- Année 1: 5,000 familles actives
- Année 2: 15,000 familles actives
- Année 3: 35,000 familles actives

#### 8.4.2 Coûts Infrastructure (Estimés)
- Coût par famille active: ~1.50€/mois (AWS + impression)
- Croissance non-linéaire avec économies d'échelle

## 9. Coût Estimatif pour le MVP

| Service | Coût Mensuel Estimé |
|---------|---------------------|
| Cognito | Gratuit jusqu'à 50,000 MAU |
| S3 | ~0,023$/GB stocké/mois + bande passante |
| RDS PostgreSQL | ~$15-25/mois (t3.micro) |
| SES | ~$0,10/1000 emails |
| EC2/Beanstalk | ~$30-50/mois (avec redundancy) |
| CloudFront | ~$0.10/GB distribué |
| Lambda | ~$0,0000002/invocation (pratiquement gratuit au début) |
| Monitoring | ~$10/mois |
| **Total Estimé** | **~$80-120/mois** pour démarrage (<1000 utilisateurs) |

## 10. Phasage de Développement

### Phase 1 – MVP Simplifié (2 mois)

**Fonctionnalités Core:**
- Création de famille et invitation des membres
- Authentification simple (email + Google)
- Upload photos avec légendes
- Génération automatique d'une gazette mensuelle (1 seul template)
- Paiement via Zcredit uniquement
- Impression et envoi postal en Israël
- Interface bilingue (anglais et hébreu)
- Sécurité de base et conformité RGPD

**Reporté pour phases ultérieures:**
- Arbre généalogique
- Templates multiples
- Retouches photos
- Autres moyens de paiement (Stripe, PayPal)
- Multilinguisme complet
- Intégrations services tiers
- Applications mobiles natives

### Phase 2 – Consolidation (3 mois)

- Intégration Stripe pour paiements internationaux
- Templates personnalisés pour les gazettes
- Support multilingue étendu (français, espagnol, arabe)
- Arbre généalogique visuel
- Retouches photos basiques
- Système de cagnotte familiale
- Amélioration UX/UI basée sur feedback
- Analytics et reporting

### Phase 3 – Expansion (4 mois)

- Applications mobiles natives
- Pages supplémentaires dans gazette
- Calendriers multiples (hébraïque, musulman, chinois)
- Messagerie interne
- API publique pour intégrations
- Livre annuel imprimé
- Expansion internationale (impression locale)
- Programme partenaires

### Phase 4 – Innovation (Continues)

- IA générative pour création de contenus
- Réalité augmentée pour photos
- Assistant vocal familial
- Intégrations IoT maison connectée
- Services additionels premium

## 11. Documentation et Support

### 11.1 Documentation

- Guide utilisateur multilingue
- Base de connaissances searchable
- Tutoriels vidéo par fonctionnalité
- FAQ dynamique basée sur requêtes support
- Documentation technique API (Swagger/OpenAPI)
- Guides d'intégration pour partenaires

### 11.2 Support

- Support chat en direct (heures ouvrées)
- Système de tickets avec SLA
- Support email 24/7
- Centre d'aide communautaire
- Programme beta-testeurs pour nouvelles fonctionnalités
- Webinaires mensuels de formation
