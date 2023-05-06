import { Controller, Delete, Req, Param, Body, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFriend(@Param('id') initiatorId: string, @Body() body: {recieverId: string}, @Req() req: any) {
    return this.friendsService.deleteFriend(initiatorId, body.recieverId, req);
  }
}
