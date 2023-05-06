import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(): Promise<Pick<Post, 'title' | 'post' | 'userId'>[]> {
    return await this.prisma.post.findMany({
      select: { title: true, post: true, userId: true, likes: true, id: true },
    });
  }

  async addPost(
    postBody: { userId: string; post: string; title: string },
    req: Request,
  ): Promise<Post> {
    const currentUser = await this.usersService.getMe(postBody.userId, req);

    const { posts } = await this.prisma.user.update({
      where: {
        id: postBody.userId,
      },
      data: {
        posts: {
          create: {
            title: postBody.title,
            post: postBody.post,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    return posts.at(-1);
  }

  async togglePostLike(
    likePostBody: { userId: string; postId: string },
    req: Request,
  ) {
    const { postId, userId } = likePostBody;
    const currentUser = await this.usersService.getMe(userId, req);

    const pressedLike = await this.prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (pressedLike) {
      await this.prisma.like.delete({
        where: {
          id: pressedLike.id,
        },
      });
    } else {
      await this.prisma.like.create({
        data: {
          userId: likePostBody.userId,
          postId: likePostBody.postId,
        },
      });
    }

    return {
      result: 'success',
    };
  }
}
