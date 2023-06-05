import {
  Controller,
  Param,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  Delete,
  Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getme')
  getMyUser(@Req() req: any) {
    return this.usersService.getMe(req);
  }

  @Get(':id')
  getUserById(@Param('id') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Delete()
  deleteAll() {
    return this.usersService.deleteUsers()
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser (@Req() req: any, @Body() body: Omit<User, 'password' | 'createdAt' | 'updatedAt'>) {
    return this.usersService.updateUser(req, body);
  }
}
