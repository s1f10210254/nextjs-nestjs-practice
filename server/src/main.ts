import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', //NextjsのURL
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
