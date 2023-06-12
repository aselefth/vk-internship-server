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
      private usersService: UsersService,
   ) {}

   async getSentRequests(req: Request): Promise<{ sentRequests: User[] }> {
      const currentUser = await this.usersService.getMe(req);

      return await this.prisma.user.findFirst({
         where: {
            id: currentUser.id,
         },
         select: {
            sentRequests: true,
         },
      });
   }

   async getRecievedRequests(
      req: Request,
   ): Promise<{ recievedRequests: User[] }> {
      const currentUser = await this.usersService.getMe(req);

      return await this.prisma.user.findFirst({
         where: {
            id: currentUser.id,
         },
         select: {
            recievedRequests: true,
         },
      });
   }

   async sendRequest(recieverId: string, req: Request) {
      const currentUser = await this.usersService.getMe(req);

      await this.prisma.user.update({
         where: {
            id: currentUser.id,
         },
         data: {
            sentRequests: {
               connect: {
                  id: recieverId,
               },
            },
         },
      });

      return {
         result: 'success',
      };
   }

   async deleteMyRequest(recieverId: string, req: Request) {
      const currentUser = await this.usersService.getMe(req);
      if (!currentUser) throw new BadRequestException();

      await this.prisma.user.update({
         where: {
            id: currentUser.id,
         },
         data: {
            sentRequests: {
               disconnect: {
                  id: recieverId,
               },
            },
         },
      });

      return {
         result: 'success',
      };
   }

   async declineRequest(recieverId: string, req: Request) {
      const currentUser = await this.usersService.getMe(req);
      if (!currentUser) throw new BadRequestException();

      await this.prisma.user.update({
         where: {
            id: currentUser.id,
         },
         data: {
            recievedRequests: {
               disconnect: {
                  id: recieverId,
               },
            },
         },
      });

      return {
         result: 'success',
      };
   }

   async acceptRequest(recieverId: string, req: Request) {
      const currentUser = await this.usersService.getMe(req);

      await this.prisma.user.update({
         where: {
            id: currentUser.id,
         },
         data: {
            recievedRequests: {
               disconnect: {
                  id: recieverId,
               },
            },
            friendsRelation: {
               connect: {
                  id: recieverId,
               },
            },
            friends: {
               connect: {
                  id: recieverId,
               },
            },
         },
      });

      return { result: 'success' };
   }

   async getIsSubscribed(id: string, req: Request) {
      const me = req.user as { email: string; id: string };

      const res = await this.prisma.user.findFirst({
         where: {
            id,
            recievedRequests: {
               some: {
                  id: me.id,
               },
            },
         },
      });

      if (!res) {
         return { ok: false, isSubscribed: false };
      }

      return { ok: true, isSubscribed: true };
   }
}
