import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, RequestsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
