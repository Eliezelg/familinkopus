import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CognitoService } from './cognito.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto } from './dto/auth.dto';
import { Language } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cognitoService: CognitoService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    try {
      // Enregistrer l'utilisateur dans Cognito
      await this.cognitoService.registerUser(
        registerDto.email,
        registerDto.password,
        {
          'given_name': registerDto.firstName,
          'family_name': registerDto.lastName,
          'email': registerDto.email,
        },
      );

      // Créer l'utilisateur dans la base de données
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          language: registerDto.language || Language.FR,
        },
      });

      return {
        message: 'Utilisateur créé avec succès. Veuillez vérifier votre email pour confirmer votre compte.',
        userId: user.id,
      };
    } catch (error) {
      // Gérer les erreurs spécifiques à Cognito
      if (error.name === 'UsernameExistsException') {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Authentifier l'utilisateur avec Cognito
      const authResult = await this.cognitoService.login(
        loginDto.email,
        loginDto.password,
      );

      if (!authResult.AuthenticationResult) {
        throw new UnauthorizedException('Identifiants invalides');
      }

      // Récupérer l'utilisateur depuis la base de données
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Mettre à jour la dernière connexion
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Générer un JWT pour les appels API backend
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          language: user.language,
        },
        tokens: {
          accessToken,
          idToken: authResult.AuthenticationResult.IdToken,
          refreshToken: authResult.AuthenticationResult.RefreshToken,
        },
      };
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Identifiants invalides');
      }
      if (error.name === 'UserNotConfirmedException') {
        throw new UnauthorizedException('Email non confirmé. Veuillez vérifier votre email');
      }
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.cognitoService.forgotPassword(forgotPasswordDto.email);
      return {
        message: 'Instructions de réinitialisation envoyées à votre email',
      };
    } catch (error) {
      if (error.name === 'UserNotFoundException') {
        throw new NotFoundException('Aucun compte avec cet email n\'a été trouvé');
      }
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      await this.cognitoService.confirmForgotPassword(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
        resetPasswordDto.code,
      );
      return {
        message: 'Mot de passe réinitialisé avec succès',
      };
    } catch (error) {
      if (error.name === 'CodeMismatchException') {
        throw new UnauthorizedException('Code de vérification invalide');
      }
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.cognitoService.refreshToken(
        refreshTokenDto.refreshToken,
      );

      if (!result.AuthenticationResult) {
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }

      return {
        tokens: {
          idToken: result.AuthenticationResult.IdToken,
          accessToken: result.AuthenticationResult.AccessToken,
          refreshToken: refreshTokenDto.refreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        children: true,
        familyMemberships: {
          include: {
            family: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }
}
