import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
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
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { postId: string },
  ) {
    return this.filesService.uploadFile(file.path, body.postId);
  }

  @Get()
  async getFile(@Query() query: { postId?: string; userId?: string }, @Res() res: any) {
    const file = await this.filesService.getFile({
      postId: query.postId,
      userId: query.userId,
    });
    console.log('FILE PIPE');
    file.pipe(res);
  }
}
