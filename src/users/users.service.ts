import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { GetUserDto } from './dto/getUser.dto';

@Injectable()
export class UsersService {
  public constructor(private prisma: PrismaService) {}

  async getAll(): Promise<GetUserDto[]> {
    return await this.prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        id: true,
        email: true,
        sentRequests: true,
        recievedRequests: true,
        friends: true,
        posts: true,
      },
    });
  }

  async getMe(req: Request): Promise<User> {
    const requestingUser = req.user as { email: string; id: string };
    const user = await this.prisma.user.findFirst({
      where: { id: requestingUser.id },
      include: { sentRequests: true, recievedRequests: true },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async deleteUsers() {
    await this.prisma.user.deleteMany();
  }

  async getUserById(
    userId: string,
  ): Promise<Omit<User, 'createdAt' | 'updatedAt' | 'password'>> {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        age: true,
        city: true,
        university: true,
        id: true,
        email: true,
        filePath: true,
        sentRequests: true,
        recievedRequests: true,
        friends: true
      },
    });
  }

  async updateUser(
    req: Request,
    body: Omit<User, 'password' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ ok: boolean }> {
    const me = req.user as { email: string; id: string };

    const updatedUser = await this.prisma.user.update({
      where: {
        id: me.id,
      },
      data: { ...body },
    });

    if (!updatedUser) {
      return { ok: false };
    }

    return { ok: true };
  }
}
