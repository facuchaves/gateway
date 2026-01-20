import { EntityService } from '../../src/entity/entity.service';
import { GenericEntityRepository } from '../../src/entity/entity.repository';

describe('EntityService (unit)', () => {
  let service: EntityService;
  let repo: jest.Mocked<GenericEntityRepository>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      insert: jest.fn(),
      preload: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

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
      repo.find.mockResolvedValue([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ] as any);

      const result = await service.getEntityById(2);

      expect(result).toEqual({ id: 2, name: 'B' });
    });

    it('should return undefined when entity does not exist', async () => {
      repo.find.mockResolvedValue([{ id: 1 }] as any);

      const result = await service.getEntityById(99);

      expect(result).toBeUndefined();
    });
  });

  describe('createNewEntity', () => {
    it('should create entity and return id', async () => {
      repo.insert.mockResolvedValue({
        identifiers: [{ id: 10 }],
      } as any);

      const dto = { name: 'Test', score: 5 };

      const result = await service.createNewEntity(dto);

      expect(repo.insert).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 10 });
    });
  });

  describe('editEntityById', () => {
    it('should return updated false when entity does not exist', async () => {
      repo.preload.mockResolvedValue(null);

      const result = await service.editEntityById(1, { name: 'New' });

      expect(repo.save).not.toHaveBeenCalled();
      expect(result).toEqual({ updated: false });
    });

    it('should save entity and return updated true when entity exists', async () => {
      const entity = { id: 1, name: 'Old' };
      repo.preload.mockResolvedValue(entity as any);

      const result = await service.editEntityById(1, { name: 'New' });

      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({ updated: true });
    });
  });

  describe('deleteEntityById', () => {
    it('should return deleted true when entity no longer exists', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.deleteEntityById(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should return deleted false when entity still exists', async () => {
      repo.findOne.mockResolvedValue({ id: 1 } as any);

      const result = await service.deleteEntityById(1);

      expect(result).toEqual({ deleted: false });
    });
  });
});
