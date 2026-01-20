import { /*CacheModule,*/ Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericEntity } from './entities/generic-entity.entity';
import { EntityController } from './entity.controller';
import { GenericEntityRepository } from './entity.repository';
import { EntityService } from './entity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenericEntity]),
    Repository,
    GenericEntity,
    GenericEntityRepository,
    // CacheModule.register(),
  ],
  controllers: [EntityController],
  providers: [EntityService],
  exports: [TypeOrmModule],
})
export class EntityModule {}
