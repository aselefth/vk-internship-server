import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReadStream, createReadStream, unlink } from 'fs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
  public constructor(private readonly prisma: PrismaService) {}

  async uploadPostFile(
    filePath: string,
    postId: string,
  ): Promise<{ ok: boolean }> {
    const res = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        filePath,
      },
    });

    if (res) {
      return { ok: true };
    }

    return { ok: false };
  }

  async uploadUserFile(
    filePath: string,
    userId: string,
  ): Promise<{ ok: boolean }> {
    const res = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        filePath,
      },
    });

    if (res) {
      return { ok: true };
    }

    return { ok: false };
  }

  async getFile({
    postId,
    userId,
  }: {
    postId?: string;
    userId?: string;
  }): Promise<ReadStream> {
    if (postId) {
      const filePath = (
        await this.prisma.post.findFirst({
          where: { id: postId },
          select: { filePath: true },
        })
      ).filePath;

      return createReadStream(filePath);
    } else if (userId) {
      const {filePath} = (
        await this.prisma.user.findFirst({
          where: { id: userId },
          select: { filePath: true },
        })
      );

      if (!filePath) {
        return;
      }

      return createReadStream(filePath);
    }
  }

  async deleteFile({
    req,
    filePath,
    postId,
  }: {
    req: Request;
    filePath: string;
    postId?: string;
  }): Promise<{ ok: boolean; error?: string }> {
    const me = req.user as { email: string; id: string };

    console.log(filePath, 'FILE PATH')
    unlink(filePath, (err) => {
      if (err) {
        return { ok: false, error: err };
      }
    });

    if (postId) {
      await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          filePath: '',
        },
      });
    } else {
      await this.prisma.user.update({
        where: {
          id: me.id,
        },
        data: {
          filePath: '',
        },
      });
    }

    return { ok: true };
  }
}
