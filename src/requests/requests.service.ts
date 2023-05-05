import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FriendRequest, User } from '@prisma/client';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RequestsService {
  public constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  async getSentRequests(id: string, req: Request): Promise<{sentRequests: FriendRequest[]}> {
    const currentUser = await this.usersService.getMe(id, req);

    return await this.prisma.user.findUnique({where: {id}, select: {sentRequests: true}})
  }

  async getRecievedRequests(id: string, req: Request): Promise<{recievedRequests: FriendRequest[]}> {
    const currentUser = await this.usersService.getMe(id, req);

    const {recievedRequests} = await this.prisma.user.findUnique({where: {id: currentUser.id}, select: {recievedRequests: true}})

    return {
      recievedRequests
    }
  }

  async sendRequest(initiatorId: string, recieverId: string, req: Request) {

    const currentUser = await this.usersService.getMe(initiatorId, req);
    if (!currentUser) throw new BadRequestException();

    await this.prisma.user.update({
      where: {
        id: initiatorId,
      },
      data: {
        sentRequests: {
          create: {
            recieverId,
          },
        },
      },
    });

    return {
      result: 'success',
    };
  }

  async deleteMyRequest(initiatorId: string, requestId: string, req: Request): Promise<User> {

    const currentUser = await this.usersService.getMe(initiatorId, req);

    const updatedUser = await this.prisma.user.update({data: {
      sentRequests: {
        delete: {
          id: requestId
        }}
      },
      where: {
        id: initiatorId
      }
    })

    return updatedUser
  }

  async declineRequest (initiatorId: string, requestId: string, req: Request): Promise<User> {
    const currentUser = await this.usersService.getMe(initiatorId, req);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        recievedRequests: {
          delete: {
            id: requestId
          }
        }
      }
    });

    return updatedUser;
  }
}
