import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityModule } from './entity/entity.module';
import { UserMiddleware } from './middlewares/user.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './entity/entities/generic-entity.entity';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    EntityModule,
    CacheModule.register(),
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot(
      isTest
        ? {
            type: 'better-sqlite3',
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
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('/');
  }
}
