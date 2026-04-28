

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Angular frontend
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
}
bootstrap();

