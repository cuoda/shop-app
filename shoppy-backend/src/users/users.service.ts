import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(
    data: CreateUserRequestDto,
  ): Promise<Pick<User, 'email' | 'id'>> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
        select: {
          email: true,
          id: true,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      // @ts-ignore
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'User with this email already exists',
        );
      }
      throw error;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }

  async getMe(userId: number) {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: { id: userId },
        select: { id: true, email: true },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
