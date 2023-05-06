import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll() {
    return this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(
    @Body() postBody: { userId: string; post: string; title: string },
    @Req() req: any,
  ) {
    return this.postsService.addPost(postBody, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  togglePostLike(
    @Body() likePostBody: { userId: string; postId: string },
    @Req() req: any,
  ) {
    return this.postsService.togglePostLike(likePostBody, req);
  }
}
