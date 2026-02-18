import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  ENTITY_MICROSERVICE_LOCAL_NAME,
  ENTITY_MICROSERVICE_NAME,
} from '../../src/entity/entity.constans';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const entityClientMock = {
    send: jest.fn(),
  };

  const localEntityClientMock = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: (_ctx, next) => next.handle(),
      })
      .overrideProvider(ENTITY_MICROSERVICE_NAME)
      .useValue(entityClientMock)
      .overrideProvider(ENTITY_MICROSERVICE_LOCAL_NAME)
      .useValue(localEntityClientMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/resource', () => {
    describe('GET', () => {
      beforeEach(() => {
        entityClientMock.send.mockReset();
        localEntityClientMock.send.mockReset();
      });

      it('it should return 200 code', async () => {
        entityClientMock.send.mockReturnValueOnce(
          of([{ id: 1, name: 'test entity', score: 1 }]),
        );
        await request(app.getHttpServer()).get('/api/resource').expect(200);
      });

      it('it should return correct body)', async () => {
        entityClientMock.send.mockReturnValueOnce(
          of([{ id: 1, name: 'test entity', score: 10 }]),
        );
        const response = await request(app.getHttpServer()).get(
          '/api/resource',
        );
        await expect(response.body).toEqual([
          { id: 1, name: 'test entity', score: 10 },
        ]);
      });
    });

    describe('POST', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('it should return 201 code', async () => {
        entityClientMock.send.mockReturnValueOnce(of({ id: 1 }));
        await request(app.getHttpServer())
          .post('/api/resource')
          .send({
            id: 0,
            name: 'Rebeca',
            score: 67,
          })
          .expect(201);
      });

      it('it should return 400 on bad params)', async () => {
        await request(app.getHttpServer())
          .post('/api/resource')
          .send({})
          .expect(400);
      });
    });

    describe('PUT', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('it should return 200 code', async () => {
        entityClientMock.send.mockReturnValueOnce(of({ updated: true }));
        await request(app.getHttpServer())
          .put('/api/resource/1')
          .send({
            name: 'Rebeca',
            score: 67,
          })
          .expect(200);
      });

      it('it should return updated true)', async () => {
        entityClientMock.send.mockReturnValueOnce(of({ updated: true }));
        const response = await request(app.getHttpServer())
          .put('/api/resource/1')
          .send({
            name: 'Rebeca',
            score: 67,
          });
        await expect(response.body).toEqual({ updated: true });
      });
    });

    describe('DELETE', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('it should return 200 code', async () => {
        entityClientMock.send.mockReturnValueOnce(of({ deleted: true }));
        await request(app.getHttpServer())
          .delete('/api/resource/1')
          .expect(200);
      });

      it('it should return deleted true)', async () => {
        entityClientMock.send.mockReturnValueOnce(of({ deleted: true }));
        const response = await request(app.getHttpServer()).delete(
          '/api/resource/1',
        );
        await expect(response.body).toEqual({ deleted: true });
      });
    });
  });
});
