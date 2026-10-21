
import {
  Body,
  Controller,
  Get,
  Req,
  Post,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwtAuth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }


@Post('login')
@UseGuards(ThrottlerGuard)
login(
  @Body() loginDto: LoginDto,
  @Req() request: Request,
) {
  return this.authService.login(loginDto, {
    ipAddress: request.ip ?? null,
    userAgent: request.get('user-agent') ?? null,
  });
}


@Post('logout')
@UseGuards(JwtAuthGuard)
logout(@Req() request: Request) {
  const authorization = request.headers.authorization;
  const accessToken = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!accessToken) {
    throw new UnauthorizedException(
      'Token d’authentification manquant.',
    );
  }

  return this.authService.logout(accessToken);
}


  @Get('verify-email')
  verifyEmail(
    @Query('token') token: string,
  ) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @UseGuards(ThrottlerGuard)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
}
}
