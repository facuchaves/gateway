require('newrelic');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { Logger } from '@nestjs/common';
const fs = require('fs');
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      retryAttempts: 5,
      retryDelay: 3000,
      host: process.env.LOCAL_MICROSERVICE_HOST,
      port: parseInt(process.env.LOCAL_MICROSERVICE_POST),
    },
  });

  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('CRUDX Example')
    .setDescription(
      'This is a litlle but very complete CRUDX for an generic entity.',
    )
    .setVersion(process.env.APP_VERSION || '1.0.0')
    .addTag('Recourses')
    // .addServer('https://')
    // .addServer('http://localhost:8080/')
    .addCookieAuth('x-token', {
      name: 'x-token',
      description: 'here is a description, maybe can give a default value',
    } as SecuritySchemeObject)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.enableCors();

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      name: 'session',
    }),
  );

  app.use(cookieParser());

  app.useLogger(new Logger());
  const PORT = process.env.PORT || 8080;

  await app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    console.log(`Service version: ${process.env.APP_VERSION || 'v1.0.0'}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
