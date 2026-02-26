import { GenericEntity } from './entities/generic-entity.entity';
import { EntityDto } from './dtos/entity.dto';
import { CreateEntityRequestDto } from './dtos/create-entity-request.dto';

export class EntityMapper {
  static toDto(entity: GenericEntity): EntityDto {
    return { ...entity };
  }

  static toDtoList(entities: GenericEntity[]): EntityDto[] {
    return entities.map(EntityMapper.toDto);
  }

  static toEntity(dto: CreateEntityRequestDto): Partial<GenericEntity> {
    return { ...dto };
  }
}
