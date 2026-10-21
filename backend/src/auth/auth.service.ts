
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';

import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { EmailService } from './email.service.js';
import { UsersService } from '../users/users.service.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

import { User } from '../users/entities/user.entity.js';
import { EmailVerification } from './entities/email-verification.entity.js';
import { PasswordReset } from './entities/password-reset.entity.js';
import { UserSession } from './entities/user-session.entity.js';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,

    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,

    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,

    private readonly emailService: EmailService,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, language } = registerDto;

    const existingUsername =
      await this.usersService.findByUsername(username);

    if (existingUsername) {
      throw new ConflictException(
        'Ce nom d’utilisateur est déjà utilisé.',
      );
    }

    const existingEmail =
      await this.usersService.findByEmail(email);

    if (existingEmail) {
      throw new ConflictException(
        'Cette adresse email est déjà utilisée.',
      );
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await this.usersService.createUser({
      username,
      email,
      passwordHash,
      language,
    });

    const verificationToken = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const verification =
      this.emailVerificationRepository.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

    await this.emailVerificationRepository.save(verification);

    await this.emailService.sendVerificationEmail(
      email,
      username,
      verificationToken,
      user.language,
    );

    return {
      message:
        'Compte créé. Un email de confirmation a été envoyé.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        language: user.language,
        isVerified: user.isVerified,
      },
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException(
        'Token de vérification manquant.',
      );
    }

    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const verification =
      await this.emailVerificationRepository.findOne({
        where: { tokenHash },
        relations: { user: true },
      });

    if (!verification) {
      throw new BadRequestException(
        'Token de vérification invalide.',
      );
    }

    if (verification.usedAt) {
      throw new BadRequestException(
        'Ce token de vérification a déjà été utilisé.',
      );
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException(
        'Ce token de vérification a expiré.',
      );
    }

    if (verification.user.isVerified) {
      throw new BadRequestException(
        'Cette adresse email est déjà vérifiée.',
      );
    }

    await this.usersService.verifyUserEmail(
      verification.user.id,
    );

    verification.usedAt = new Date();

    await this.emailVerificationRepository.save(verification);

    return {
      message: 'Adresse email vérifiée avec succès.',
    };
  }

  async login(
    loginDto: LoginDto,
    metadata: {
      ipAddress: string | null;
      userAgent: string | null;
    },
  ) {
    const { identifier, password } = loginDto;

    const user =
      await this.usersService.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException(
        'Identifiants incorrects.',
      );
    }

    // Vérifier si le compte est toujours bloqué.
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new HttpException(
        'Trop de tentatives incorrectes. Réessayez dans une heure.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Si le blocage est terminé, réinitialiser le compteur.
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await this.userRepository.update(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
      });

      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      password,
    );

    if (!passwordValid) {
      // Incrément atomique du compteur en base.
      await this.userRepository.increment(
        { id: user.id },
        'failedLoginAttempts',
        1,
      );

      // Relire le compteur actualisé.
      const updatedUser =
        await this.userRepository.findOne({
          where: { id: user.id },
        });

      if (
        updatedUser &&
        updatedUser.failedLoginAttempts >= 3
      ) {
        const lockedUntil = new Date(
          Date.now() + 60 * 60 * 1000,
        );

        await this.userRepository.update(user.id, {
          lockedUntil,
        });

        throw new HttpException(
          'Trois tentatives incorrectes. Compte bloqué pendant une heure.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new UnauthorizedException(
        'Identifiants incorrects.',
      );
    }

    // Un mot de passe correct réinitialise les échecs.
    await this.userRepository.update(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Veuillez confirmer votre adresse email avant de vous connecter.',
      );
    }

    // Générer le JWT avec sa durée actuelle de 15 minutes.
    const payload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Conserver uniquement l'empreinte SHA-256 du JWT en base.
    const tokenHash = createHash('sha256')
      .update(accessToken)
      .digest('hex');

    // Enregistrer la session dans la table existante.
    const session = this.userSessionRepository.create({
      userId: user.id,
      tokenHash,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      revokedAt: null,
    });

    await this.userSessionRepository.save(session);

    return {
      message: 'Connexion réussie.',
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        language: user.language,
        isVerified: user.isVerified,
      },
    };
  }

  
async logout(accessToken: string) {
  const tokenHash = createHash('sha256')
    .update(accessToken)
    .digest('hex');

  const result = await this.userSessionRepository.update(
    {
      tokenHash,
      revokedAt: IsNull(),
    },
    {
      revokedAt: new Date(),
    },
  );

  if (result.affected !== 1) {
    throw new UnauthorizedException(
      'Session introuvable ou déjà révoquée.',
    );
  }

  return {
    message: 'Déconnexion réussie.',
  };
}


  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const genericResponse = {
      message:
        'Si un compte correspond à cette adresse, un email de réinitialisation sera envoyé.',
    };

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isVerified) {
      return genericResponse;
    }

    // Invalider les anciens liens encore utilisables.
    await this.passwordResetRepository.update(
      {
        userId: user.id,
        usedAt: IsNull(),
      },
      {
        usedAt: new Date(),
      },
    );

    // Générer un jeton aléatoire et conserver uniquement son empreinte.
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const passwordReset = this.passwordResetRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    await this.passwordResetRepository.save(passwordReset);

    if (!user.email) {
      return genericResponse;
    }

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.username,
      token,
      user.language,
    );

    return genericResponse;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        tokenHash,
        usedAt: IsNull(),
      },
      relations: {
        user: true,
      },
    });

    if (!passwordReset) {
      throw new BadRequestException(
        'Lien de réinitialisation invalide ou déjà utilisé.',
      );
    }

    if (passwordReset.expiresAt <= new Date()) {
      throw new BadRequestException(
        'Le lien de réinitialisation a expiré.',
      );
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });

    await this.userRepository.update(passwordReset.user.id, {
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    // Invalider le jeton utilisé.
    passwordReset.usedAt = new Date();
    await this.passwordResetRepository.save(passwordReset);

    // Invalider également les autres liens de réinitialisation du compte.
    await this.passwordResetRepository.update(
      {
        userId: passwordReset.user.id,
        usedAt: IsNull(),
      },
      {
        usedAt: new Date(),
      },
    );

    return {
      message: 'Mot de passe réinitialisé avec succès.',
    };
  }
}
