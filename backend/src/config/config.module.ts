import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3001),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        AWS_REGION: Joi.string().required(),
        AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
        AWS_COGNITO_CLIENT_ID: Joi.string().required(),
        AWS_COGNITO_CLIENT_SECRET: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_REGION: Joi.string().required(),
        AWS_S3_ACCESS_KEY: Joi.string().required(),
        AWS_S3_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
