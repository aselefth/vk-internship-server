import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, UsersService, JwtStrategy]
})
export class PostsModule {}
