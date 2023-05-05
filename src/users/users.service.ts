import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { GetUserDto } from './dto/getUser.dto';

@Injectable()
export class UsersService {
  public constructor(private prisma: PrismaService) {}

  async getAll(): Promise<GetUserDto[]> {
    return await this.prisma.user.findMany({
      select: { firstName: true, lastName: true, id: true, email: true, sentRequests: true, recievedRequests: true }
    });
  }

  async getMe(id: string, req: Request): Promise<User> {

    const user = await this.prisma.user.findUnique({ where: { id }, include: {sentRequests: true, recievedRequests: true} });
    if (!user) throw new NotFoundException();

    const requestingUser = req.user as { email: string; id: string };
    if (user.id !== requestingUser.id) throw new ForbiddenException();
    return user;
  }
}
