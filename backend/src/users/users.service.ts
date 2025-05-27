import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        children: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async updateProfilePicture(userId: string, profilePicture: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });
  }

  async getChildren(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        children: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user.children;
  }

  async createChild(userId: string, createChildDto: CreateChildDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.child.create({
      data: {
        ...createChildDto,
        parentId: userId,
        dateOfBirth: createChildDto.dateOfBirth ? new Date(createChildDto.dateOfBirth) : null,
      },
    });
  }

  async updateChild(userId: string, childId: string, updateChildDto: UpdateChildDto) {
    const child = await this.prisma.child.findFirst({
      where: {
        id: childId,
        parentId: userId,
      },
    });

    if (!child) {
      throw new NotFoundException('Enfant non trouvé');
    }

    const updateData: any = { ...updateChildDto };
    if (updateChildDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateChildDto.dateOfBirth);
    }

    return this.prisma.child.update({
      where: { id: childId },
      data: updateData,
    });
  }

  async deleteChild(userId: string, childId: string) {
    const child = await this.prisma.child.findFirst({
      where: {
        id: childId,
        parentId: userId,
      },
    });

    if (!child) {
      throw new NotFoundException('Enfant non trouvé');
    }

    await this.prisma.child.delete({
      where: { id: childId },
    });

    return { message: 'Enfant supprimé avec succès' };
  }
}
