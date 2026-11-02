import { Request, Response, NextFunction } from 'express';

interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<unknown> | unknown;
}

interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): void;
}

export const asyncHandler = (requestHandler: RequestHandler): AsyncRequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};



