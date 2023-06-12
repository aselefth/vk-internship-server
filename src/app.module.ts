import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RequestsModule } from './requests/requests.module';
import { FriendsModule } from './friends/friends.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    RequestsModule,
    FriendsModule,
    FilesModule,
    MulterModule.register({ dest: './uploads' }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
