// test/entity.e2e-spec.ts
import { Test } from '@nestjs/testing';
import {
  Transport,
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { INestMicroservice } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Entity Microservice (E2E)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeAll(async () => {
    // Levantar el microservicio REAL
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 9091, // ⚠️ puerto distinto al prod
      },
    });

    await new Promise<void>((resolve) => {
      app.listen(() => resolve());
    });

    // Cliente REAL
    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 9091,
      },
    });

    await client.connect();
  });

  afterAll(async () => {
    await client.close();
    await app.close();
  });

  // ---------- TESTS ----------

  it('get_all_entities', async () => {
    const result = await client
      .send({ cmd: 'get_all_entities' }, {})
      .toPromise();

    expect(Array.isArray(result)).toBe(true);
  });

  it('create_entity', async () => {
    const entity = {
      name: 'Test Entity',
      score: 20,
    };

    const result = await client
      .send({ cmd: 'create_entity' }, entity)
      .toPromise();

    expect(result).toHaveProperty('id');
  });

  it('get_entity_by_id', async () => {
    const created = await client
      .send({ cmd: 'create_entity' }, { name: 'Find me', score: 30 })
      .toPromise();

    const result = await client
      .send({ cmd: 'get_entity_by_id' }, created.id)
      .toPromise();

    expect(result.id).toBe(created.id);
  });

  it('edit_entity', async () => {
    const created = await client
      .send({ cmd: 'create_entity' }, { name: 'Old name', score: 40 })
      .toPromise();

    const updated = await client
      .send(
        { cmd: 'edit_entity' },
        {
          entityId: created.id,
          entityParam: { name: 'New name' },
        },
      )
      .toPromise();

    expect(updated).toStrictEqual({ updated: true });
  });

  it('delete_entity_by_id', async () => {
    const created = await client
      .send({ cmd: 'create_entity' }, { name: 'To delete', score: 50 })
      .toPromise();

    const result = await client
      .send({ cmd: 'delete_entity_by_id' }, created.id)
      .toPromise();

    expect(result).toStrictEqual({ deleted: true });
  });
});
