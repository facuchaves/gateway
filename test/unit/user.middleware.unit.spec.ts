import { UserMiddleware } from '../../src/middlewares/user.middleware';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

describe('User middleware (Unit)', () => {
  const userMiddleware: UserMiddleware = new UserMiddleware(new Logger());
  describe('Happy paths', () => {
    it(`should fill req`, async () => {
      const req = {
        headers: {
          token: '{ "name": "UserNameReq" }',
        },
      };

      userMiddleware.use(req as any, {} as Response, jest.fn());

      expect(req['user']).toStrictEqual({ name: 'UserNameReq' });
    });

    it(`should fill res`, async () => {
      const res: Response = {} as Response;

      userMiddleware.use({ headers: {} } as Request, res, jest.fn());

      expect(res['user']).toStrictEqual({ name: 'UserNameRes' });
    });

    it(`should call next()`, async () => {
      const mockedObject = {
        mockedMethod: jest.fn(),
      };

      const funtionSpies = jest.spyOn(mockedObject, 'mockedMethod');

      const nextFunction: NextFunction = (() =>
        mockedObject.mockedMethod()) as NextFunction;

      userMiddleware.use(
        { headers: {} } as Request,
        {} as Response,
        nextFunction,
      );

      expect(funtionSpies).toBeCalledTimes(1);
    });
  });
});
