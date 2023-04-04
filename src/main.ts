import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import { Logger } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3001;
  app.enableCors();
  await app.listen(PORT);
  Logger.log(`Server running on port ${PORT}`, "main")
}
bootstrap();
