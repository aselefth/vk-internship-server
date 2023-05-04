import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { PrismaService } from './prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.enableCors()
	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe({whitelist: true}))
	app.use(cookieParser())

  const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

  await app.listen(3001);
}
bootstrap();
