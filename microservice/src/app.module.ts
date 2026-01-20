import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './entity/entities/generic-entity.entity';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot(
      isTest
        ? {
            type: 'sqlite',
            database: ':memory:',
            entities: [GenericEntity],
            synchronize: true,
            dropSchema: true,
          }
        : {
            type: 'mysql',
            host: process.env.DDBB_HOST,
            username: process.env.DDBB_USERNAME,
            password: process.env.DDBB_PASSWORD,
            database: process.env.DDBB_DATABASE,
            entities: [GenericEntity],
            synchronize: true,
          },
    ),

    EntityModule,
  ],
})
export class AppModule {}
