
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import type { Request } from 'express';

import { UsersService } from '../../users/users.service.js';
import { UserSession } from '../entities/user-session.entity.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET est manquant dans le fichier .env.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: {
      sub: string;
      username: string;
    },
  ) {
    // Vérifier que le JWT est présent dans la requête.
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      request,
    );

    if (!token) {
      throw new UnauthorizedException(
        'Token d’authentification manquant.',
      );
    }

    // Calculer l'empreinte SHA-256 du JWT.
    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    // Vérifier que la session existe, appartient à l'utilisateur,
    // n'est pas révoquée et n'a pas expiré.
    const session = await this.userSessionRepository.findOne({
      where: {
        tokenHash,
        userId: payload.sub,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!session) {
      throw new UnauthorizedException(
        'Session invalide, expirée ou révoquée.',
      );
    }

    // Conserver la vérification de l'utilisateur existante.
    const user = await this.usersService.findByUsername(
      payload.username,
    );

    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException(
        'Utilisateur introuvable.',
      );
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      language: user.language,
      isVerified: user.isVerified,
    };
  }
}
