import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private cognitoClient: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION') || 'eu-central-1',
    });
    this.userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL_ID') || '';
    this.clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('AWS_COGNITO_CLIENT_SECRET') || '';
  }

  async registerUser(email: string, password: string, userAttributes: Record<string, string>) {
    try {
      const attributeList = Object.entries(userAttributes).map(([key, value]) => ({
        Name: key,
        Value: value,
      }));

      const command = new SignUpCommand({
        ClientId: this.clientId,
        Password: password,
        Username: email,
        UserAttributes: attributeList,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        ConfirmationCode: confirmationCode,
        Username: email,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: email,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async confirmForgotPassword(email: string, password: string, confirmationCode: string) {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        ConfirmationCode: confirmationCode,
        Password: password,
        Username: email,
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      });

      return await this.cognitoClient.send(command);
    } catch (error) {
      throw error;
    }
  }
}
