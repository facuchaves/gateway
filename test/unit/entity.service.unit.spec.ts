import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EntityDto } from '../../src/entity/dtos/entity.dto';
import { EntityService } from '../../src/entity/entity.service';

describe('Entity service (Unit)', () => {
  const clientProxy: ClientProxy = {
    send: (_pattern: any, _data: any) => new Observable(),
  } as ClientProxy;
  const clientProxyLocal: ClientProxy = {
    send: (_pattern: any, _data: any) => new Observable(),
  } as ClientProxy;
  const entityService: EntityService = new EntityService(
    clientProxy,
    clientProxyLocal,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should return all entities', async () => {
      const clientProxySpies = jest.spyOn(clientProxy, 'send');

      entityService.getAllEntities();

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith({ cmd: 'get_all_entities' }, {});
    });

    it('should return all entities local', async () => {
      const clientProxySpies = jest.spyOn(clientProxyLocal, 'send');

      entityService.getAllEntitiesLocal();

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith({ cmd: 'get_all_entities' }, {});
    });

    it('should return specific entities', async () => {
      const idToFind = 1;

      const clientProxySpies = jest.spyOn(clientProxy, 'send');

      entityService.getEntityById(idToFind);

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith(
        { cmd: 'get_entity_by_id' },
        idToFind,
      );
    });

    it('should create new entity', async () => {
      const clientProxySpies = jest.spyOn(clientProxy, 'send');

      const entityToCreate: EntityDto = { name: 'Name', score: 50 };
      entityService.createNewEntity(entityToCreate);

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith(
        { cmd: 'create_entity' },
        entityToCreate,
      );
    });

    it('should update entity', async () => {
      const clientProxySpies = jest.spyOn(clientProxy, 'send');

      const entityToUpdate: EntityDto = { name: 'Name', score: 50 };
      const entityIdToUpdate = 1;
      entityService.editEntityById(entityIdToUpdate, entityToUpdate);

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith(
        { cmd: 'edit_entity' },
        { entityId: entityIdToUpdate, entityParam: entityToUpdate },
      );
    });

    it('should delete entity', async () => {
      const clientProxySpies = jest.spyOn(clientProxy, 'send');

      const entityIdToDelete = 1;
      entityService.deleteEntityById(entityIdToDelete);

      expect(clientProxySpies).toBeCalledTimes(1);
      expect(clientProxySpies).toBeCalledWith(
        { cmd: 'delete_entity_by_id' },
        entityIdToDelete,
      );
    });
  });
});
