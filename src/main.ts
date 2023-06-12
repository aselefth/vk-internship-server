import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './prisma.service';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.enableCors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
 })
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3001);
}
bootstrap();
