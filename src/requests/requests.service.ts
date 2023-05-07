import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RequestsService {
  public constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  async getSentRequests(id: string, req: Request) {

  }

  async getRecievedRequests(id: string, req: Request) {

  }

  async sendRequest(recieverId: string, req: Request) {

    const currentUser = await this.usersService.getMe(req);
    console.log(currentUser)

    await this.prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        sentRequests: {
          connect: {
            id: recieverId
          }
        }
      }
    })

    return {
      result: 'success',
    };
  }

  async deleteMyRequest(recieverId: string, req: Request) {

    const currentUser = await this.usersService.getMe(req);
    if (!currentUser) throw new BadRequestException();
    
    await this.prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        sentRequests: {
          disconnect: {
            id: recieverId
          }
        }
      }
    })

    return {
      result: 'success'
    }
  }

  async declineRequest (recieverId: string, req: Request) {
   
    const currentUser = await this.usersService.getMe(req);
    if (!currentUser) throw new BadRequestException();

    await this.prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        recievedRequests: {
          disconnect: {
            id: recieverId
          }
        }
      }
    });

    return {
      result: 'success'
    }
  }

  async acceptRequest (recieverId: string, req: Request) {
    const currentUser = await this.usersService.getMe(req);

    await this.prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        recievedRequests: {
          disconnect: {
            id: recieverId
          }
        },
        friendsRelation: {
          connect: {
            id: recieverId
          }
        },
        friends: {
          connect: {
            id: recieverId
          }
        }
      }
    });

    return {result: 'success'}
  }
}
