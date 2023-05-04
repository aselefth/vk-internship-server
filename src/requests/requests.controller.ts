import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/myrequests')
  getMyRequests(@Param('id') id: string, @Req() req: any) {
    return this.requestsService.getSentRequests(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/recievedrequests')
  getRecievedRequests(@Param('id') id: string, @Req() req: any) {
    return this.requestsService.getRecievedRequests(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  sendRequest(@Body() body: {initiatorId: string}, @Param('id') recieverId: string, @Req() req: any) {
    return this.requestsService.sendRequest(body.initiatorId, recieverId, req);
  }
}
