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

  async getAll(): Promise<Pick<Post, 'id'>[]> {
    const posts = await this.prisma.post.findMany({
      select: { id: true },
    });

    return posts.reverse();
  }

  async getUserPostsById(userId: string): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        userId,
      },
    });
  }

  async getPostById(postId: string): Promise<Post> {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        userId: true,
        post: true,
        likedBy: true,
        createdAt: true,
        filePath: true,
      },
    });
  }

  async addPost(postBody: { post: string }, req: Request): Promise<Post> {
    const currentUser = await this.usersService.getMe(req);

    const { posts } = await this.prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        posts: {
          create: {
            post: postBody.post,
            filePath: '',
          },
        },
      },
      include: {
        posts: true,
      },
    });

    return posts.find((post) => post.post === postBody.post);
  }

  async togglePostLike(likePostBody: { postId: string }, req: Request) {
    const { postId } = likePostBody;
    const currentUser = await this.usersService.getMe(req);

    const myLike = await this.prisma.user.findFirst({
      where: {
        id: currentUser.id,
        likedPosts: {
          some: {
            id: postId,
          },
        },
      },
    });

    if (myLike) {
      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedBy: {
            disconnect: {
              id: currentUser.id,
            },
          },
        },
      });
    } else {
      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likedBy: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });
    }

    return {
      result: 'success',
    };
  }

  async deletePosts() {
    await this.prisma.post.deleteMany();
  }

  async getLikedPosts(id: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        likedBy: {
          some: {
            id,
          },
        },
      },
    });

    return posts;
  }
}
