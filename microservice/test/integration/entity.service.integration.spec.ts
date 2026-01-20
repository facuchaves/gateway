import { EntityService } from '../../src/entity/entity.service';
import {
  Repository,
  createConnection,
  getConnection,
  getRepository,
} from 'typeorm';
import { GenericEntity } from '../../src/entity/entities/generic-entity.entity';
import { EntityDto } from '../../src/entity/dtos/entity.dto';
import { CreateGenericEntityDto } from '../../src/entity/dtos/create-generic-entity.dto';
import { CreateGenericEntityResponseDto } from '../../src/entity/dtos/create-generic-entity.response.dto';
import { DeleteGenericEntityResponseDto } from '../../src/entity/dtos/delete-generic-entity.response.dto';
import { UpdateGenericEntityDto } from 'src/entity/dtos/update-generic-entity.dto';

describe('Entity Service(Integration)', () => {
  let service: EntityService;
  let repository: Repository<GenericEntity>;
  let loadedEntity: EntityDto;

  const testConnectionName = 'testConnection';
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [GenericEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });

    repository = getRepository(GenericEntity, testConnectionName);
    service = new EntityService(repository);
    const preLoadEntity: CreateGenericEntityDto = {
      name: 'Pre-Loaded Entity Name',
      score: 10,
    };
    const response: CreateGenericEntityResponseDto = await service.createNewEntity(
      preLoadEntity,
    );

    loadedEntity = {
      ...preLoadEntity,
      ...response,
    };
  });

  afterAll(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Query', () => {
    it('should return specific entity', async () => {
      expect(await service.getEntityById(loadedEntity.id)).toEqual(
        loadedEntity,
      );
    });

    it('should return list of entities', async () => {
      const allEntites = await service.getAllEntities();

      expect(allEntites).toHaveLength(1);
      expect(allEntites[0]).toEqual(loadedEntity);
    });
  });

  describe('Create', () => {
    it('should create new entity', async () => {
      const entity: CreateGenericEntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: CreateGenericEntityResponseDto = await service.createNewEntity(
        entity,
      );
      const createdEntity = await service.getEntityById(
        createGenericEntityResponseDto.id,
      );

      expect(createdEntity).toEqual({
        ...createGenericEntityResponseDto,
        ...entity,
      });
    });
  });

  describe('Update', () => {
    it('should update existing entity', async () => {
      const entity: CreateGenericEntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: CreateGenericEntityResponseDto = await service.createNewEntity(
        entity,
      );

      await service.editEntityById(createGenericEntityResponseDto.id, {
        name: 'Pepe test editado',
      } as UpdateGenericEntityDto);

      const updatedEntity = await service.getEntityById(
        createGenericEntityResponseDto.id,
      );

      expect(updatedEntity.name).toEqual('Pepe test editado');
    });

    it('should fail updating non-existing entity', async () => {
      const entity: UpdateGenericEntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const nonExitingEntityId = -1;

      const res = await service.editEntityById(nonExitingEntityId, entity);

      expect(res).toEqual({ updated: false });
    });
  });

  describe('Delete', () => {
    it('should delete from database entity', async () => {
      const entity: CreateGenericEntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: CreateGenericEntityResponseDto = await service.createNewEntity(
        entity,
      );

      await service.deleteEntityById(createGenericEntityResponseDto.id);

      const res: EntityDto = await service.getEntityById(
        createGenericEntityResponseDto.id,
      );

      expect(res).toBeUndefined();
    });

    it('should reponse deleted=true on delete', async () => {
      const entity: CreateGenericEntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createdEntityResponseDto: CreateGenericEntityResponseDto = await service.createNewEntity(
        entity,
      );

      const deleteGenericEntityResponseDto: DeleteGenericEntityResponseDto = await service.deleteEntityById(
        createdEntityResponseDto.id,
      );

      expect(deleteGenericEntityResponseDto).toEqual({ deleted: true });
    });
  });
});
