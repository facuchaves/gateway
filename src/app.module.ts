import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityModule } from './entity/entity.module';
import { UserMiddleware } from './middlewares/user.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntity } from './entity/entities/generic-entity.entity';
import ssmConfig from './config/ssm.config';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    EntityModule,
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ssmConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (isTest) {
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            entities: [GenericEntity],
            synchronize: true,
            dropSchema: true,
          };
        }

        return {
          type: 'mysql',
          host: configService.get<string>('ssm.DDBB_HOST') || process.env.DDBB_HOST,
          username: configService.get<string>('ssm.DDBB_USERNAME') || process.env.DDBB_USERNAME,
          password: configService.get<string>('ssm.DDBB_PASSWORD') || process.env.DDBB_PASSWORD,
          database: configService.get<string>('ssm.DDBB_DATABASE') || process.env.DDBB_DATABASE,
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
