import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('posts')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          const fileName = `${uniqueSuffix}${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadPostFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { postId: string },
  ) {
    return this.filesService.uploadPostFile(file.path, body.postId);
  }

  @Post('users')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = extname(file.originalname);
          const fileName = `${uniqueSuffix}${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadUserFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: string },
  ) {
    return this.filesService.uploadUserFile(file.path, body.userId);
  }

  @Get()
  async getFile(
    @Query() query: { postId?: string; userId?: string },
    @Res() res: any,
  ) {
    const file = await this.filesService.getFile({
      postId: query.postId,
      userId: query.userId,
    });
    file.pipe(res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteFile(
    @Req() req: any,
    @Query() query: { postId?: string },
    @Body() {filePath}: any,
  ) {
    return this.filesService.deleteFile({
      req,
      postId: query.postId,
      filePath,
    });
  }
}
