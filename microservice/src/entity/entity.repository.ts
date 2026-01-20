import { Injectable } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { GenericEntity } from './entities/generic-entity.entity';

@Injectable()
@EntityRepository(GenericEntity)
export class GenericEntityRepository extends Repository<GenericEntity> {}
