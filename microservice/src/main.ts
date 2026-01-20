import 'newrelic';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const PORT = parseInt(process.env.PORT) || 9090;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: PORT,
      },
    },
  );

  app.listen(() => {
    logger.log(`Server listening on port ${PORT}...`);
    logger.log(`Service version: ${process.env.APP_VERSION || 'v1.0.0'}`);
  });
}
bootstrap();
