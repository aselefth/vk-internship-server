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
  @Post()
  sendRequest(@Body() body: {recieverId: string}, @Req() req: any) {
    return this.requestsService.sendRequest(body.recieverId, req);
  }
  

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteMyRequest(@Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.deleteMyRequest(body.recieverId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('decline')
  declineRequest(@Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.declineRequest(body.recieverId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept')
  acceptRequest(@Body() body: {recieverId: string}, @Req() req: any ) {
    return this.requestsService.acceptRequest(body.recieverId, req);
  }
}
