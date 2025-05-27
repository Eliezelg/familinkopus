import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminGetUserCommand,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';
import { randomUUID } from 'crypto';

@Injectable()
export class CognitoService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get('AWS_REGION'),
    });
    this.userPoolId = this.configService.get('AWS_COGNITO_USER_POOL_ID') || '';
    this.clientId = this.configService.get('AWS_COGNITO_CLIENT_ID') || '';

    if (!this.userPoolId || !this.clientId) {
      throw new Error('AWS Cognito configuration is missing');
    }
  }

  async registerUser(
    email: string,
    password: string,
    attributes: Record<string, string> = {},
  ) {
    const attributeList: AttributeType[] = [
      { Name: 'email', Value: email },
      ...Object.entries(attributes).map(([key, value]) => ({
        Name: key,
        Value: value,
      })),
    ];

    // Générer un nom d'utilisateur unique puisque le pool utilise l'email comme alias
    const username = `user_${randomUUID()}`;

    const command = new SignUpCommand({
      ClientId: this.clientId,
      Password: password,
      Username: username,
      UserAttributes: attributeList,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return {
        ...response,
        Username: username, // Retourner le nom d'utilisateur généré pour les confirmations futures
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(username: string, confirmationCode: string) {
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resendConfirmationCode(username: string) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: username,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email, // Avec l'alias email, on peut utiliser l'email pour se connecter
        PASSWORD: password,
      },
    });

    try {
      const response = await this.cognitoClient.send(command);
      if (!response.AuthenticationResult) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return response;
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  async forgotPassword(username: string) {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async confirmForgotPassword(
    username: string,
    password: string,
    confirmationCode: string,
  ) {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username,
      Password: password,
      ConfirmationCode: confirmationCode,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getUser(username: string) {
    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    try {
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
