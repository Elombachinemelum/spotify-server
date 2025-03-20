import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FullUser } from 'src/types';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    newUser: Prisma.UserCreateInput,
  ): Promise<Prisma.UserCreateInput> {
    return await this.prismaService.user.create({ data: newUser });
  }

  async getUserByEmail(email: string): Promise<Prisma.UserCreateInput | null> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async getUserById(id: string): Promise<Prisma.UserCreateInput | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getFullUserById(id: string): Promise<FullUser | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: {
        playList: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            description: true,
            songs: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                artists: { select: { name: true } },
              },
            },
          },
        },
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
