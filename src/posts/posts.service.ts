import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GetPostDto } from './dto/getPosts.dto';

@Injectable()
export class PostsService {
  public constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<GetPostDto[]> {
    return await this.prisma.post.findMany({
      select: { title: true, post: true, userId: true }
    });
  }
}
