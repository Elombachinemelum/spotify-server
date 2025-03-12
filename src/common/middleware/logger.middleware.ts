import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request...from Ip address ${req.ip}`);
    next(); //pass the request to the next middleware or to the route handler if there is no more registered middleware.
  }
}
