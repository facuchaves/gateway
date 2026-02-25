import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { GenericEntity } from '../../src/entity/entities/generic-entity.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let preloadEntity: GenericEntity;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: (_ctx, next) => next.handle(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const repository = moduleFixture.get<Repository<GenericEntity>>(
      getRepositoryToken(GenericEntity),
    );

    preloadEntity = await repository.save({ name: 'test entity', score: 10 });
  });

  describe('/api/resource', () => {
    describe('GET', () => {
      beforeEach(() => {});

      it('it should return 200 code', async () => {
        await request(app.getHttpServer()).get('/api/resource').expect(200);
      });

      it('it should return correct body)', async () => {
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
        await request(app.getHttpServer())
          .post('/api/resource')
          .send({
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
        await request(app.getHttpServer())
          .put(`/api/resource/${preloadEntity.id}`)
          .send({
            name: 'Rebeca',
            score: 67,
          })
          .expect(200);
      });

      it('it should return updated entity', async () => {
        const response = await request(app.getHttpServer())
          .put(`/api/resource/${preloadEntity.id}`)
          .send({
            name: 'Updated',
            score: 60,
          });
        await expect(response.body).toEqual({
          id: 1,
          name: 'Updated',
          score: 60,
        });
      });

      it('it should return 404 code when entity doesnt exist', async () => {
        await request(app.getHttpServer())
          .put(`/api/resource/-1`)
          .send({
            name: 'Rebeca',
            score: 67,
          })
          .expect(404);
      });
    });

    describe('DELETE', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      it('it should return 200 code', async () => {
        await request(app.getHttpServer())
          .delete('/api/resource/1')
          .expect(204);
      });
    });
  });
});
