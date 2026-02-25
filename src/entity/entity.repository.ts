import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericEntity } from './entities/generic-entity.entity';

@Injectable()
export class GenericEntityRepository {
  constructor(
    @InjectRepository(GenericEntity)
    private readonly repository: Repository<GenericEntity>,
  ) {}

  find() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  create(dto: Partial<GenericEntity>): GenericEntity {
    return this.repository.create(dto);
  }

  save(entity: GenericEntity): Promise<GenericEntity> {
    return this.repository.save(entity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  preload(entity: Partial<GenericEntity>): Promise<GenericEntity> {
    return this.repository.preload(entity);
  }
}
