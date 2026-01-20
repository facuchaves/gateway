import { RolesGuard } from '../../src/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('Roles Guard (Unit)', () => {
  describe('Happy paths', () => {
    it(`should acept user with admin rol`, async () => {
      const reflector: Reflector = {
        get: (_propertyName: string, _any) => ['admin'],
      } as Reflector;

      const rolesGuard: RolesGuard = new RolesGuard(reflector);

      const context: ExecutionContext = ({
        switchToHttp: () => ({
          getRequest: () => {
            return { user: { roles: ['admin'] } };
          },
        }),
        getHandler: jest.fn(),
      } as unknown) as ExecutionContext;

      expect(rolesGuard.canActivate(context)).toBeTruthy();
    });

    it(`should deny user with another rol`, async () => {
      const reflector: Reflector = {
        get: (_propertyName: string, _any) => ['admin'],
      } as Reflector;

      const rolesGuard: RolesGuard = new RolesGuard(reflector);

      const context: ExecutionContext = ({
        switchToHttp: () => ({
          getRequest: () => {
            return { user: { roles: ['ro'] } };
          },
        }),
        getHandler: jest.fn(),
      } as unknown) as ExecutionContext;

      expect(rolesGuard.canActivate(context)).toBeFalsy();
    });

    it(`should deny user without rol`, async () => {
      const reflector: Reflector = {
        get: (_propertyName: string, _any) => ['admin'],
      } as Reflector;

      const rolesGuard: RolesGuard = new RolesGuard(reflector);

      const context: ExecutionContext = ({
        switchToHttp: () => ({
          getRequest: () => {
            return { user: { roles: [] } };
          },
        }),
        getHandler: jest.fn(),
      } as unknown) as ExecutionContext;

      expect(rolesGuard.canActivate(context)).toBeFalsy();
    });

    it(`should accept user without rol`, async () => {
      const reflector: Reflector = {
        get: (_propertyName: string, _any) => [],
      } as Reflector;

      const rolesGuard: RolesGuard = new RolesGuard(reflector);

      const context: ExecutionContext = ({
        switchToHttp: () => ({
          getRequest: () => {
            return { user: { roles: [] } };
          },
        }),
        getHandler: jest.fn(),
      } as unknown) as ExecutionContext;

      expect(rolesGuard.canActivate(context)).toBeTruthy();
    });
  });
});
