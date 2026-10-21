import {
    Controller,
    Get,
    Req,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        username: string;
        email: string | null;
        language: string;
        isVerified: boolean;
    };
}

@Controller('users')
export class UsersController {
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() request: AuthenticatedRequest) {
        if (!request.user) {
            throw new UnauthorizedException();
        }

        return {
            user: request.user,
        };
    }
}