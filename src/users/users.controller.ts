import {
  Controller,
  Param,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

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
  @Get(':id')
  getMyUser(@Param('id') id: string, @Req() req: any) {
    return this.usersService.getMe(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/requests/myrequests')
  getMyRequests(@Param('id') id: string, @Req() req: any) {
    return this.usersService.getMyRequests(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/requests/recievedrequests')
  getRecievedRequests(@Param('id') id: string, @Req() req: any) {
    return this.getRecievedRequests(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/requests/sendrequest')
  sendRequest(@Body() body: {initiatorId: string}, @Param('id') recieverId: string, @Req() req: any) {
    return this.usersService.sendRequest(body.initiatorId, recieverId, req);
  }
}
