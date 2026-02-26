import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
//import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './entities/generic-entity.entity';
import { GenericEntityRepository } from './entity.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 6379,
    // })
    TypeOrmModule.forFeature([GenericEntity]),
  ],
  controllers: [EntityController],
  providers: [EntityService, Logger, GenericEntityRepository],
})
export class EntityModule {}
