import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { initialize } from 'passport';

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
  sendRequest(@Body() body: {recieverId: string}, @Param('id') initiatorId: string, @Req() req: any) {
    return this.requestsService.sendRequest(initiatorId, body.recieverId, req);
  }
  

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteMyRequest(@Param('id') initiatorId: string, @Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.deleteMyRequest(initiatorId, body.recieverId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decline')
  declineRequest(@Param('id') initiatorId: string, @Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.declineRequest(initiatorId, body.recieverId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptRequest(@Param('id') initiatorId: string, @Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.acceptRequest(initiatorId, body.recieverId, req);
  }
}
