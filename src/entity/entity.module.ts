import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ENTITY_MICROSERVICE_LOCAL_NAME,
  ENTITY_MICROSERVICE_NAME,
} from './entity.constans';
//import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379,
    // })
    ClientsModule.register([
      {
        name: ENTITY_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: {
          host: process.env.MICROSERVICE_HOST,
          port: parseInt(process.env.MICROSERVICE_POST),
        },
      },
      {
        name: ENTITY_MICROSERVICE_LOCAL_NAME,
        transport: Transport.TCP,
        options: {
          host: process.env.LOCAL_MICROSERVICE_HOST,
          port: parseInt(process.env.LOCAL_MICROSERVICE_POST),
        },
      },
    ]),
  ],
  controllers: [EntityController],
  providers: [EntityService, Logger],
})
export class EntityModule {}
