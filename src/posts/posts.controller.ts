import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll() {
    return this.postsService.getAll();
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Get('userposts/:id')
  getUserPosts(@Param('id') id: string) {
    return this.postsService.getUserPostsById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() postBody: { post: string }, @Req() req: any) {
    return this.postsService.addPost(postBody, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  togglePostLike(@Body() likePostBody: { postId: string }, @Req() req: any) {
    return this.postsService.togglePostLike(likePostBody, req);
  }

  @Delete()
  deleteAllPosts() {
    return this.postsService.deletePosts();
  }

  @Get('/users/liked/:id')
  getLikedPosts(@Param('id') id: string) {
    return this.postsService.getLikedPosts(id);
  }
}
