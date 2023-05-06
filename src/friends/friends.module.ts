import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService, UsersService, JwtStrategy]
})
export class FriendsModule {}
