import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityModule } from './entity/entity.module';
import { UserMiddleware } from './middlewares/user.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './entity/entities/generic-entity.entity';
import { SSMService } from './config/ssm.service';
import { SSMModule } from './config/ssm.module';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    EntityModule,
    CacheModule.register(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [SSMModule],
      inject: [SSMService],
      useFactory: async (ssmService: SSMService) => {
        if (isTest) {
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [GenericEntity],
            synchronize: true,
            dropSchema: true,
          };
        }

        const paramPrefix = '/prod/microservice/';

        const params = await ssmService.getParams([
          `${paramPrefix}DDBB_TYPE`,
          `${paramPrefix}DDBB_HOST`,
          `${paramPrefix}DDBB_USERNAME`,
          `${paramPrefix}DDBB_PASSWORD`,
          `${paramPrefix}DDBB_DATABASE`,
        ]);

        console.log(params);

        return {
          type: 'mysql',
          host: params.DDBB_HOST, //|| process.env.DDBB_HOST,
          username: params.DDBB_USERNAME, // || process.env.DDBB_USERNAME,
          password: params.DDBB_PASSWORD, // || process.env.DDBB_PASSWORD,
          database: params.DDBB_DATABASE, //|| process.env.DDBB_DATABASE,
          entities: [GenericEntity],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(UserMiddleware).forRoutes('/');
  }
}
