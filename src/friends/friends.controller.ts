import { Controller, Delete, Req, Param, Body, UseGuards, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getFriends(@Req() req: any) {
    return this.friendsService.getFriends(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteFriend(@Body() body: {recieverId: string}, @Req() req: any) {
    return this.friendsService.deleteFriend(body.recieverId, req);
  }
}
