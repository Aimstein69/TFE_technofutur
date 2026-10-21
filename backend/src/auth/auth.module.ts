import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module.js';
import { User } from '../users/entities/user.entity.js';
import { UserSession } from './entities/user-session.entity.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { EmailService } from './email.service.js';
import { PasswordReset } from './entities/password-reset.entity.js';
import { EmailVerification } from './entities/email-verification.entity.js';

import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwtAuth.guard.js';
@Module({
  imports: [
    ConfigModule,

    UsersModule,

    TypeOrmModule.forFeature([
      User,
      EmailVerification,
      PasswordReset,
      UserSession,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
        ),

        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    EmailService,
    JwtStrategy,
    JwtAuthGuard,
  ],

  exports: [
    JwtModule,
  ],
})
export class AuthModule {}