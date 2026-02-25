import { EntityService } from '../../src/entity/entity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { GenericEntity } from '../../src/entity/entities/generic-entity.entity';
import { EntityDto } from '../../src/entity/dtos/entity.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenericEntityRepository } from '../../src/entity/entity.repository';
import { CreateEntityRequestDto } from '../../src/entity/dtos/create-entity-request.dto';

describe('Entity Service(Integration)', () => {
  let service: EntityService;
  let repository: GenericEntityRepository;
  let loadedEntity: EntityDto;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [GenericEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([GenericEntity]),
      ],
      providers: [EntityService, GenericEntityRepository],
    }).compile();

    service = module.get<EntityService>(EntityService);
    repository = module.get<GenericEntityRepository>(GenericEntityRepository);

    const preLoadEntity: CreateEntityRequestDto = {
      name: 'Pre-Loaded Entity Name',
      score: 10,
    };
    const response: EntityDto = await service.createEntity(preLoadEntity);

    loadedEntity = {
      ...preLoadEntity,
      ...response,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Query', () => {
    it('should return specific entity', async () => {
      expect(await service.getEntityById(loadedEntity.id as number)).toEqual(
        loadedEntity,
      );
    });

    it('should throw exception when entity doesnt exist', async () => {
      await expect(service.getEntityById(-1)).rejects.toThrow();
    });

    it('should return list of entities', async () => {
      const allEntites = await service.getAllEntities();

      expect(allEntites).toHaveLength(1);
      expect(allEntites[0]).toEqual(loadedEntity);
    });
  });

  describe('Create', () => {
    it('should create new entity', async () => {
      const entity: CreateEntityRequestDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: EntityDto =
        await service.createEntity(entity);
      const createdEntity = await service.getEntityById(
        createGenericEntityResponseDto.id as number,
      );

      expect(createdEntity).toEqual({
        ...createGenericEntityResponseDto,
        ...entity,
      });
    });
  });

  describe('Update', () => {
    it('should update existing entity', async () => {
      const entity: CreateEntityRequestDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: EntityDto =
        await service.createEntity(entity);

      await service.updateEntityById(
        createGenericEntityResponseDto.id as number,
        {
          name: 'Pepe test editado',
        } as EntityDto,
      );

      const updatedEntity = await service.getEntityById(
        createGenericEntityResponseDto.id as number,
      );

      expect(updatedEntity.name).toEqual('Pepe test editado');
    });

    it('should throw exception updating non-existing entity', async () => {
      const entity: EntityDto = {
        name: 'Pepe test',
        score: 58,
      };

      const nonExitingEntityId = -1;

      await expect(
        service.updateEntityById(nonExitingEntityId, entity),
      ).rejects.toThrow();
    });
  });

  describe('Delete', () => {
    it('should delete from database entity', async () => {
      const entity: CreateEntityRequestDto = {
        name: 'Pepe test',
        score: 58,
      };

      const createGenericEntityResponseDto: EntityDto =
        await service.createEntity(entity);

      await service.deleteEntityById(
        createGenericEntityResponseDto.id as number,
      );

      const res = await repository.findOne(
        createGenericEntityResponseDto.id as number,
      );

      expect(res).toBeNull();
    });
  });
});
