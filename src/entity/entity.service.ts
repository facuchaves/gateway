import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericEntityRepository } from './entity.repository';
import { CreateEntityRequestDto } from './dtos/create-entity-request.dto';
import { EntityDto } from './dtos/entity.dto';
import { EntityMapper } from './entity.mapper';

@Injectable()
export class EntityService {
  constructor(
    private readonly genericEntityRepository: GenericEntityRepository,
  ) {}

  async getAllEntities(): Promise<EntityDto[]> {
    return EntityMapper.toDtoList(await this.genericEntityRepository.find());
  }

  async getEntityById(id: number): Promise<EntityDto> {
    const entity = await this.genericEntityRepository.findOne(id);

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return EntityMapper.toDto(entity);
  }

  async createEntity(
    createEntityRequestDto: CreateEntityRequestDto,
  ): Promise<EntityDto> {
    const entity = this.genericEntityRepository.create(createEntityRequestDto);
    const savedEntity = await this.genericEntityRepository.save(entity);
    return EntityMapper.toDto(savedEntity);
  }

  async updateEntityById(id: number, entityDto: EntityDto): Promise<EntityDto> {
    const entityToEdit = this.genericEntityRepository.create(entityDto);

    const entity = await this.genericEntityRepository.preload({
      id,
      ...entityToEdit,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    const editedEntity = await this.genericEntityRepository.save(entity);
    return EntityMapper.toDto(editedEntity);
  }

  async deleteEntityById(id: number): Promise<void> {
    await this.genericEntityRepository.delete(id);
  }
}
