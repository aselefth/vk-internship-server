import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ReadStream, createReadStream } from 'fs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
  public constructor(private readonly prisma: PrismaService) {}

  async uploadFile(filePath: string, postId: string): Promise<{ ok: boolean }> {
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

  async getFile({ postId, userId }: { postId?: string; userId?: string }): Promise<ReadStream> {

    let filePath = '';
    if (postId) {
      filePath = (await this.prisma.post.findFirst({
        where: { id: postId },
        select: { filePath: true },
      })).filePath;
    } else {
        filePath = (await this.prisma.user.findFirst({
            where: { id: userId },
            select: { filePath: true },
          })).filePath;
    }

    return createReadStream(filePath);
  }
}
