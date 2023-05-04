import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService, JwtStrategy, UsersService]
})
export class RequestsModule {}
