import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://elianvillarroel.github.io',
    'https://elianvillarroel.github.io/FRONTENDVFINAL'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
    credentials: true,
    maxAge: 3600, // Tiempo de cache para pre-flight requests
  });

  await app.listen(3000);
}
bootstrap();
