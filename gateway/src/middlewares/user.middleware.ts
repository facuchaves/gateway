import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('UserMiddleware', UserMiddleware.name);
    if (req.headers['token']) {
      req['user'] = JSON.parse(req.headers['token'] as string);
    }
    res['user'] = { name: 'UserNameRes' };

    next();
  }
}
