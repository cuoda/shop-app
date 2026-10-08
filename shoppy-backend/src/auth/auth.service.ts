import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import type { User } from '../../generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import ms, { type StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from './interfaces/token-payload.interface';
import type { CookieOptions, Response } from 'express';

export const AUTH_COOKIE = 'Authentication';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    };
  }

  async login(user: User, response: Response) {
    const expires = new Date(
      Date.now() +
        ms(
          this.configService.getOrThrow<string>(
            'JWT_EXPIRATION',
          ) as StringValue,
        ),
    );

    const tokenPayload: ITokenPayload = { userId: user.id };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie(AUTH_COOKIE, token, { ...this.cookieOptions(), expires });

    return { tokenPayload, user: { id: user.id, email: user.email } };
  }

  logout(response: Response) {
    response.clearCookie(AUTH_COOKIE, this.cookieOptions());
    return { success: true };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  verifyToken(jwt: string): ITokenPayload {
    return this.jwtService.verify<ITokenPayload>(jwt);
  }
}
