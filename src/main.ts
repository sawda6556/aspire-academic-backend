import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting application bootstrap...');
  try {
    const app = await NestFactory.create(AppModule);
    console.log('App instance created');
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.enableCors();
    console.log('Middleware configured');

    const port = process.env.PORT ?? 3001;
    console.log(`Attempting to listen on port: ${port}`);
    console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}, LAUNCH_MODE=${process.env.LAUNCH_MODE}`);
    
    await app.listen(port, '0.0.0.0');
    console.log(`Application is successfully running on: http://0.0.0.0:${port}`);
  } catch (error) {
    console.error('Error during application bootstrap:');
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
