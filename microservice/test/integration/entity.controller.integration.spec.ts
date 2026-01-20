import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { EntityController } from '../../src/entity/entity.controller';
import { EntityService } from '../../src/entity/entity.service';

describe('EntityController (integration)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  const entityServiceMock = {
    getAllEntities: jest.fn(),
    getEntityById: jest.fn(),
    createNewEntity: jest.fn(),
    editEntityById: jest.fn(),
    deleteEntityById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityController],
      providers: [
        {
          provide: EntityService,
          useValue: entityServiceMock,
        },
      ],
    }).compile();

    app = module.createNestMicroservice({
      transport: Transport.TCP,
    });

    await new Promise<void>((resolve) => {
      app.listen(() => resolve());
    });

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
    });
  });

  afterAll(async () => {
    await app.close();
    await client.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle get_all_entities message', async () => {
    entityServiceMock.getAllEntities.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await client
      .send({ cmd: 'get_all_entities' }, {})
      .toPromise();

    expect(entityServiceMock.getAllEntities).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should handle get_entity_by_id message', async () => {
    entityServiceMock.getEntityById.mockResolvedValue({ id: 1 });

    const result = await client
      .send({ cmd: 'get_entity_by_id' }, 1)
      .toPromise();

    expect(entityServiceMock.getEntityById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should handle create_entity message', async () => {
    entityServiceMock.createNewEntity.mockResolvedValue({ id: 10 });

    const payload = { name: 'Test', score: 5 };

    const result = await client
      .send({ cmd: 'create_entity' }, payload)
      .toPromise();

    expect(entityServiceMock.createNewEntity).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ id: 10 });
  });

  it('should handle edit_entity message', async () => {
    entityServiceMock.editEntityById.mockResolvedValue({ updated: true });

    const payload = {
      entityId: 1,
      entityParam: { name: 'Updated' },
    };

    const result = await client
      .send({ cmd: 'edit_entity' }, payload)
      .toPromise();

    expect(entityServiceMock.editEntityById).toHaveBeenCalledWith(1, {
      name: 'Updated',
    });
    expect(result).toEqual({ updated: true });
  });

  it('should handle delete_entity_by_id message', async () => {
    entityServiceMock.deleteEntityById.mockResolvedValue({ deleted: true });

    const result = await client
      .send({ cmd: 'delete_entity_by_id' }, 1)
      .toPromise();

    expect(entityServiceMock.deleteEntityById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
});
