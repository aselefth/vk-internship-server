import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendsService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getFriends (req: Request): Promise<User[]> {
    const user = await this.usersService.getMe(req);

    const {friends} = await this.prisma.user.findFirst({
      where: {
        id: user.id
      },
      select: {
        friends: true
      }
    })

    return friends
  }

  async deleteFriend(
    recieverId: string, req: Request): Promise<{ user: User }> {
    const currentUser = await this.usersService.getMe(req);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friends: {
          disconnect: {
            id: recieverId,
          },
        },
        friendsRelation: {
          disconnect: {
            id: recieverId
          }
        }
      },
      include: {
        sentRequests: true,
        recievedRequests: true,
        friends: true
      }
    });

    return { user: updatedUser };
  }
}
