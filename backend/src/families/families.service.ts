import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto/family.dto';
import { CreateInvitationDto } from './dto/invitation.dto';
import { FamilyRole, InvitationStatus } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async createFamily(userId: string, createFamilyDto: CreateFamilyDto) {
    // Créer la famille
    const family = await this.prisma.family.create({
      data: {
        ...createFamilyDto,
        members: {
          create: {
            role: FamilyRole.ADMIN,
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    return family;
  }

  async getAllFamilies(userId: string) {
    const userWithFamilies = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        familyMemberships: {
          include: {
            family: true,
          },
        },
      },
    });

    if (!userWithFamilies) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return userWithFamilies.familyMemberships.map((membership) => ({
      ...membership.family,
      role: membership.role,
    }));
  }

  async getFamilyById(userId: string, familyId: string) {
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
      },
      include: {
        family: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profilePicture: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Famille non trouvée ou vous n\'êtes pas membre');
    }

    return {
      ...membership.family,
      role: membership.role,
    };
  }

  async updateFamily(userId: string, familyId: string, updateFamilyDto: UpdateFamilyDto) {
    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    const updatedFamily = await this.prisma.family.update({
      where: { id: familyId },
      data: updateFamilyDto,
    });

    return updatedFamily;
  }

  async deleteFamily(userId: string, familyId: string) {
    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    await this.prisma.family.delete({
      where: { id: familyId },
    });

    return { message: 'Famille supprimée avec succès' };
  }

  async getFamilyMembers(userId: string, familyId: string) {
    // Vérifier que l'utilisateur est membre de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'êtes pas membre de cette famille');
    }

    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('Famille non trouvée');
    }

    return family.members;
  }

  async createInvitation(userId: string, familyId: string, createInvitationDto: CreateInvitationDto) {
    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    // Vérifier si l'utilisateur existe déjà
    const invitedUser = await this.prisma.user.findUnique({
      where: { email: createInvitationDto.email },
    });

    // Si l'utilisateur existe, vérifier s'il est déjà membre
    if (invitedUser) {
      const existingMembership = await this.prisma.familyMember.findFirst({
        where: {
          userId: invitedUser.id,
          familyId,
        },
      });

      if (existingMembership) {
        throw new ConflictException('Cet utilisateur est déjà membre de la famille');
      }
    }

    // Vérifier si une invitation est déjà en cours
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: {
        email: createInvitationDto.email,
        familyId,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ConflictException('Une invitation a déjà été envoyée à cet email');
    }

    // Générer un token unique pour l'invitation
    const token = crypto.randomBytes(32).toString('hex');

    // Créer l'invitation
    const invitation = await this.prisma.invitation.create({
      data: {
        email: createInvitationDto.email,
        token,
        role: createInvitationDto.role || FamilyRole.MEMBER,
        familyId,
        invitedById: userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire dans 7 jours
      },
    });

    // TODO: Envoyer un email d'invitation

    return {
      ...invitation,
      message: 'Invitation envoyée avec succès',
    };
  }

  async acceptInvitation(userId: string, token: string) {
    // Trouver l'invitation
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { family: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation non trouvée');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('Cette invitation n\'est plus valide');
    }

    if (invitation.expiresAt < new Date()) {
      // Mettre à jour le statut de l'invitation
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new ConflictException('Cette invitation a expiré');
    }

    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.email !== invitation.email) {
      throw new ForbiddenException('Cette invitation ne vous est pas destinée');
    }

    // Vérifier si l'utilisateur est déjà membre
    const existingMembership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId: invitation.familyId,
      },
    });

    if (existingMembership) {
      // Mettre à jour le statut de l'invitation
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.ACCEPTED, acceptedAt: new Date() },
      });
      throw new ConflictException('Vous êtes déjà membre de cette famille');
    }

    // Créer le membership
    await this.prisma.familyMember.create({
      data: {
        userId,
        familyId: invitation.familyId,
        role: invitation.role,
      },
    });

    // Mettre à jour le statut de l'invitation
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED, acceptedAt: new Date() },
    });

    return {
      message: `Vous avez rejoint la famille ${invitation.family.name} avec succès`,
      familyId: invitation.familyId,
    };
  }

  async getInvitations(userId: string, familyId: string) {
    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    return this.prisma.invitation.findMany({
      where: { familyId },
      orderBy: { sentAt: 'desc' },
    });
  }

  async cancelInvitation(userId: string, invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { family: true },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation non trouvée');
    }

    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId: invitation.familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.CANCELLED },
    });

    return { message: 'Invitation annulée avec succès' };
  }

  async removeMember(userId: string, familyId: string, memberId: string) {
    // Vérifier que l'utilisateur est admin de la famille
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    const memberToRemove = await this.prisma.familyMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Membre non trouvé');
    }

    if (memberToRemove.familyId !== familyId) {
      throw new ForbiddenException('Ce membre n\'appartient pas à cette famille');
    }

    // Vérifier que l'utilisateur ne tente pas de se supprimer lui-même
    if (memberToRemove.userId === userId) {
      throw new ForbiddenException('Vous ne pouvez pas vous supprimer vous-même');
    }

    await this.prisma.familyMember.delete({
      where: { id: memberId },
    });

    return { message: 'Membre supprimé avec succès' };
  }

  async updateMemberRole(userId: string, familyId: string, memberId: string, role: FamilyRole) {
    // Vérifier que l'utilisateur est admin de la famille
    const adminMembership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
        role: FamilyRole.ADMIN,
      },
    });

    if (!adminMembership) {
      throw new ForbiddenException('Vous n\'avez pas les droits d\'administration pour cette famille');
    }

    const memberToUpdate = await this.prisma.familyMember.findUnique({
      where: { id: memberId },
    });

    if (!memberToUpdate) {
      throw new NotFoundException('Membre non trouvé');
    }

    if (memberToUpdate.familyId !== familyId) {
      throw new ForbiddenException('Ce membre n\'appartient pas à cette famille');
    }

    // Un admin ne peut pas se rétrograder lui-même
    if (memberToUpdate.userId === userId && role !== FamilyRole.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez pas vous rétrograder vous-même');
    }

    const updatedMember = await this.prisma.familyMember.update({
      where: { id: memberId },
      data: { role },
    });

    return updatedMember;
  }

  async leaveFamily(userId: string, familyId: string) {
    const membership = await this.prisma.familyMember.findFirst({
      where: {
        userId,
        familyId,
      },
    });

    if (!membership) {
      throw new NotFoundException('Vous n\'êtes pas membre de cette famille');
    }

    // Vérifier s'il s'agit du dernier admin
    if (membership.role === FamilyRole.ADMIN) {
      const adminCount = await this.prisma.familyMember.count({
        where: {
          familyId,
          role: FamilyRole.ADMIN,
        },
      });

      if (adminCount === 1) {
        // C'est le dernier admin, vérifier s'il y a d'autres membres
        const memberCount = await this.prisma.familyMember.count({
          where: {
            familyId,
          },
        });

        if (memberCount > 1) {
          throw new ForbiddenException('Vous ne pouvez pas quitter la famille car vous êtes le seul administrateur. Veuillez d\'abord nommer un autre administrateur.');
        }
      }
    }

    await this.prisma.familyMember.delete({
      where: { id: membership.id },
    });

    // Si c'était le dernier membre, supprimer la famille
    const remainingMembers = await this.prisma.familyMember.count({
      where: {
        familyId,
      },
    });

    if (remainingMembers === 0) {
      await this.prisma.family.delete({
        where: { id: familyId },
      });
      return { message: 'Vous avez quitté la famille et celle-ci a été supprimée car vous étiez le dernier membre' };
    }

    return { message: 'Vous avez quitté la famille avec succès' };
  }
}
