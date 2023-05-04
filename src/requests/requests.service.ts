import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class RequestsService {
  public constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getSentRequests(
    id: string,
    req: Request,
  ): Promise<{ sentRequests: User[] }> {
    const myUser = await this.usersService.getMe(id, req);
    if (!myUser) throw new ForbiddenException();

    return await this.prisma.user.findUnique({
      where: { email: myUser.email },
      select: { sentRequests: true },
    });
  }

  async getRecievedRequests(
    id: string,
    req: Request,
  ): Promise<{ recievedRequests: User[] }> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { recievedRequests: true },
    });
  }

  async sendRequest(
    initiatorId: string,
    recieverId: string,
    req: Request,
  ): Promise<{ result: 'success' }> {
    const reciever = await this.prisma.user.findFirst({
      where: { id: recieverId },
      select: { firstName: true, lastName: true, email: true, id: true },
    });

	console.log(recieverId);

    if (!reciever) throw new BadRequestException();

    const initiator = await this.usersService.getMe(initiatorId, req);

    await this.prisma.user.update({
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
	  where: {
        id: initiatorId,
      }
    });

	await this.prisma.user.update({
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
	  where: {
        id: recieverId,
      }
    });

    return { result: 'success' };
  }
}
