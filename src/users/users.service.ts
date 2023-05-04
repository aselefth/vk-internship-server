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
      select: { firstName: true, lastName: true, id: true, email: true },
    });
  }

  async getMe(id: string, req: Request): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();

    const requestingUser = req.user as { email: string; id: string };
    if (user.id !== requestingUser.id) throw new ForbiddenException();
    return user;
  }

  async getMyRequests(id: string, req: Request): Promise<{sentRequests: User[]}> {
    const myUser = await this.getMe(id, req);
    if (!myUser) throw new ForbiddenException();

    return await this.prisma.user.findUnique({
      where: { email: myUser.email },
      select: { sentRequests: true },
    });
  }

  async getRecievedRequests(id:string, req: Request): Promise<{recievedRequests: User[]}> {
    return await this.prisma.user.findUnique({
      where: {id},
      select: {recievedRequests: true}
    })
  }

  async sendRequest(
    initiatorId,
    recieverId: string,
    req: Request,
  ): Promise<{ result: 'success' }> {
    const reciever = await this.prisma.user.findUnique({
      where: { id: recieverId },
      select: { firstName: true, lastName: true, email: true, id: true },
    });

    if (!reciever) throw new BadRequestException();

    const initiator = await this.getMe(initiatorId, req);

    const updatedInitiator = await this.prisma.user.update({
      where: {
        id: initiatorId,
      },
      data: {
        sentRequests: {
          create: {
            firstName: reciever.firstName,
            lastName: reciever.lastName,
            email: reciever.email,
            password: '',
            id: reciever.id,
          },
        },
      },
    });

    if (!updatedInitiator) throw new BadRequestException();

    const updatedReciever = await this.prisma.user.update({
      where: {
        id: recieverId,
      },
      data: {
        recievedRequests: {
          create: {
            firstName: initiator.firstName,
            lastName: initiator.lastName,
            email: initiator.email,
            password: '',
            id: initiator.id,
          },
        },
      },
    });

    if (!updatedReciever) throw new BadRequestException();

    return { result: 'success' };
  }
}
