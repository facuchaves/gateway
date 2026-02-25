import { EntityService } from '../../src/entity/entity.service';
import { GenericEntityRepository } from '../../src/entity/entity.repository';

describe('EntityService (unit)', () => {
  let service: EntityService;
  let repo: jest.Mocked<GenericEntityRepository>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<GenericEntityRepository>;

    service = new EntityService(repo);
    jest.clearAllMocks();
  });

  describe('getAllEntities', () => {
    it('should return all entities from repository', async () => {
      repo.find.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);

      const result = await service.getAllEntities();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('getEntityById', () => {
    it('should return entity when it exists', async () => {
      repo.findOne.mockResolvedValue({ id: 2, name: 'B' } as any);

      const result = await service.getEntityById(2);

      expect(result).toEqual({ id: 2, name: 'B' });
    });

    it('should throw an exception when entity does not exist', async () => {
      repo.findOne.mockResolvedValue(undefined as any);

      await expect(service.getEntityById(99)).rejects.toThrow();
    });
  });

  describe('createNewEntity', () => {
    it('should create entity and return it', async () => {
      const dto = { name: 'Test', score: 5 };

      repo.save.mockResolvedValue({ id: 10, ...dto });

      const result = await service.createEntity(dto);

      expect(result).toEqual({ id: 10, ...dto });
    });
  });

  describe('updateEntityById', () => {
    it('should throw an exception when entity does not exist', async () => {
      repo.preload.mockResolvedValue(undefined as any);

      await expect(
        service.updateEntityById(1, {
          name: 'New',
          score: 50,
        }),
      ).rejects.toThrow();

      expect(repo.save).not.toHaveBeenCalled();
    });
  });
});
