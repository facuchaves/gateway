import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('RolesMiddleware');
    req['user'] = { name: 'UserNameReq' };
    res['user'] = { name: 'UserNameRes' };
    next();
  }
}
