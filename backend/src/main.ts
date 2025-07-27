import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://localhost:3000',
      'https://your-app-name.vercel.app',
      'https://*.vercel.app',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe())

  const port = process.env.PORT || 3001
  await app.listen(port, '0.0.0.0');

  console.log(`Mandinow Backend running on port ${port}`);
}
bootstrap();
