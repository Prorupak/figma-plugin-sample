import { NextFunction, Request, Response } from "express";

export const catchAsync =
  <T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return fn(req, res, next)
      .then(() => undefined)
      .catch(next);
  };
