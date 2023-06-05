import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReadStream, createReadStream } from 'fs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
  public constructor(private readonly prisma: PrismaService) {}

  async uploadPostFile(filePath: string, postId: string): Promise<{ ok: boolean }> {
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

  async uploadUserFile(filePath: string, userId: string): Promise<{ ok: boolean }> {
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
    } else {
      const filePath = (
        await this.prisma.user.findFirst({
          where: { id: userId },
          select: { filePath: true },
        })
      ).filePath;

      return createReadStream(filePath);
    }
  }
}
