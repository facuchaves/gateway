import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EntityDto } from './dtos/entity.dto';
import {
  ENTITY_MICROSERVICE_LOCAL_NAME,
  ENTITY_MICROSERVICE_NAME,
} from './entity.constans';
import { EntityMicroserviceResponseDto } from './dtos/entity-microservice-response.dto';
import { CreateGenericEntityMicroserviceResponseDto } from './dtos/create-generic-entity-microservice-response.dto';
import { UpdateGenericEntityMicroserviceResponseDto } from './dtos/update-generic-entity-microservice-response.dto';
import { DeleteGenericEntityMicroserviceResponseDto } from './dtos/delete-generic-entity-microservice-response.dto';

@Injectable()
export class EntityService {
  constructor(
    @Inject(ENTITY_MICROSERVICE_NAME) private client: ClientProxy,
    @Inject(ENTITY_MICROSERVICE_LOCAL_NAME) private localClient: ClientProxy,
  ) {}

  async getAllEntitiesLocal(): Promise<EntityMicroserviceResponseDto[]> {
    const pattern = { cmd: 'get_all_entities' };
    return this.localClient
      .send<EntityMicroserviceResponseDto[]>(pattern, {})
      .toPromise();
  }

  async getAllEntities(): Promise<EntityMicroserviceResponseDto[]> {
    const pattern = { cmd: 'get_all_entities' };
    return this.client
      .send<EntityMicroserviceResponseDto[]>(pattern, {})
      .toPromise();
  }

  async getEntityById(
    entityIdToSearch: number,
  ): Promise<EntityMicroserviceResponseDto> {
    const pattern = { cmd: 'get_entity_by_id' };
    return this.client
      .send<EntityMicroserviceResponseDto>(pattern, entityIdToSearch)
      .toPromise();
  }

  createNewEntity(
    entityDto: EntityDto,
  ): Promise<CreateGenericEntityMicroserviceResponseDto> {
    const pattern = { cmd: 'create_entity' };
    return this.client
      .send<CreateGenericEntityMicroserviceResponseDto>(pattern, entityDto)
      .toPromise();
  }

  editEntityById(
    entityId: number,
    entityDto: EntityDto,
  ): Promise<UpdateGenericEntityMicroserviceResponseDto> {
    const pattern = { cmd: 'edit_entity' };
    const payload = { entityId: entityId, entityParam: entityDto };
    return this.client
      .send<UpdateGenericEntityMicroserviceResponseDto>(pattern, payload)
      .toPromise();
  }

  deleteEntityById(
    entityIdToDelete: number,
  ): Promise<DeleteGenericEntityMicroserviceResponseDto> {
    const pattern = { cmd: 'delete_entity_by_id' };
    return this.client
      .send<DeleteGenericEntityMicroserviceResponseDto>(
        pattern,
        entityIdToDelete,
      )
      .toPromise();
  }
}
