import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Req,
   UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { initialize } from 'passport';

@Controller('requests')
export class RequestsController {
   constructor(private readonly requestsService: RequestsService) {}

   @UseGuards(JwtAuthGuard)
   @Get('myrequests')
   getMyRequests(@Req() req: any) {
      return this.requestsService.getSentRequests(req);
   }

   @UseGuards(JwtAuthGuard)
   @Get('recievedrequests')
   getRecievedRequests(@Req() req: any) {
      return this.requestsService.getRecievedRequests(req);
   }

   @UseGuards(JwtAuthGuard)
   @Post()
   sendRequest(@Body() body: { recieverId: string }, @Req() req: any) {
      return this.requestsService.sendRequest(body.recieverId, req);
   }

   @UseGuards(JwtAuthGuard)
   @Delete()
   deleteMyRequest(@Body() body: { recieverId: string }, @Req() req: any) {
      return this.requestsService.deleteMyRequest(body.recieverId, req);
   }

   @UseGuards(JwtAuthGuard)
   @Post('decline')
   declineRequest(@Body() body: { recieverId: string }, @Req() req: any) {
      return this.requestsService.declineRequest(body.recieverId, req);
   }

   @UseGuards(JwtAuthGuard)
   @Post('accept')
   acceptRequest(@Body() body: { recieverId: string }, @Req() req: any) {
      return this.requestsService.acceptRequest(body.recieverId, req);
   }

   @UseGuards(JwtAuthGuard)
   @Get(':id/isSubscribed')
   getIsSubscribed(@Param('id') id: string, @Req() req: any) {
      return this.requestsService.getIsSubscribed(id, req);
   }
}
