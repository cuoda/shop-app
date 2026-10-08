import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  // rawBody: true -> Stripe webhook signature verify ke liye zaroori
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: config.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  const port = config.getOrThrow<string>('PORT');
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error occurred while starting the application:', err);
  process.exit(1);
});
