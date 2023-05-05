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
    return 
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/recievedrequests')
  getRecievedRequests(@Param('id') id: string, @Req() req: any) {
    return
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  sendRequest(@Body() body: {recieverId: string}, @Param('id') initiatorId: string, @Req() req: any) {
    return this.requestsService.sendRequest(body.recieverId, initiatorId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteMyRequest(@Param('id') initiatorId: string, @Body() body: {requestId: string}, @Req() req: any ) {
    return this.requestsService.deleteMyRequest(initiatorId, body.requestId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/decline')
  declineRequest(@Param('id') initiatorId: string, @Body() body: {requestId: string}, @Req() req: any ) {
    return this.requestsService.declineRequest(initiatorId, body.requestId, req);
  }
}
