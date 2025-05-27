import { PrismaClient } from '@prisma/client';
import { Language, FamilyRole } from '../src/common/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding de la base de données...');

  // Créer un utilisateur de test
  const testUser = await prisma.user.upsert({
    where: { email: 'test@familink.com' },
    update: {},
    create: {
      email: 'test@familink.com',
      cognitoId: 'test-cognito-id',
      firstName: 'Jean',
      lastName: 'Dupont',
      language: Language.FR,
      emailVerified: true,
    },
  });

  console.log('Utilisateur de test créé:', testUser);

  // Créer une famille de test
  const testFamily = await prisma.family.upsert({
    where: { id: 'test-family-id' },
    update: {},
    create: {
      id: 'test-family-id',
      name: 'Famille Dupont',
      description: 'Une famille de test pour le développement',
      language: Language.FR,
      members: {
        create: {
          role: FamilyRole.ADMIN,
          userId: testUser.id,
        },
      },
    },
  });

  console.log('Famille de test créée:', testFamily);

  // Créer un enfant de test
  const testChild = await prisma.child.upsert({
    where: { id: 'test-child-id' },
    update: {},
    create: {
      id: 'test-child-id',
      firstName: 'Lucas',
      lastName: 'Dupont',
      dateOfBirth: new Date('2015-05-15'),
      parentId: testUser.id,
    },
  });

  console.log('Enfant de test créé:', testChild);

  console.log('Seeding terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
