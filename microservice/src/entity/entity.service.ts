import { Injectable } from '@nestjs/common';
import { GenericEntityRepository } from './entity.repository';
import { EntityDto } from './dtos/entity.dto';
import { CreateGenericEntityDto } from './dtos/create-generic-entity.dto';
import { UpdateGenericEntityDto } from './dtos/update-generic-entity.dto';
import { UpdateGenericEntityResponseDto } from './dtos/update-generic-entity.response.dto';
import { CreateGenericEntityResponseDto } from './dtos/create-generic-entity.response.dto';
import { DeleteGenericEntityResponseDto } from './dtos/delete-generic-entity.response.dto';

@Injectable()
export class EntityService {
  constructor(private genericEntityRepository: GenericEntityRepository) {}

  async getAllEntities(): Promise<EntityDto[]> {
    return await this.genericEntityRepository.find();
  }

  async getEntityById(entityIdToSearch: number): Promise<EntityDto> {
    const allEntities = await this.getAllEntities();
    return allEntities.find((entity) => entity.id == entityIdToSearch);
  }

  async createNewEntity(
    newEntity: CreateGenericEntityDto,
  ): Promise<CreateGenericEntityResponseDto> {
    const res = await this.genericEntityRepository.insert(newEntity);
    return { id: res.identifiers[0].id };
  }

  async editEntityById(
    id: number,
    entityDto: UpdateGenericEntityDto,
  ): Promise<UpdateGenericEntityResponseDto> {
    const entity = await this.genericEntityRepository.preload({
      id,
      ...entityDto,
    });

    if (!entity) {
      return { updated: false };
    }

    await this.genericEntityRepository.save(entity);
    return { updated: true };
  }

  async deleteEntityById(
    entityId: number,
  ): Promise<DeleteGenericEntityResponseDto> {
    await this.genericEntityRepository.delete(entityId);

    const exists = await this.genericEntityRepository.findOne({
      where: { id: entityId },
    });

    return { deleted: !exists };
  }
}
