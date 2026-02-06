import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EntityModule } from './entity/entity.module';
import { UserMiddleware } from './middlewares/user.middleware';

@Module({
  imports: [EntityModule, CacheModule.register()],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('/');
  }
}
