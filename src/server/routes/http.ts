import type { Request, Response, NextFunction } from 'express';
import type { ApiResult } from '../../shared/types';

export function ok<T>(response: Response, data: T): void {
  response.json({ ok: true, data } satisfies ApiResult<T>);
}

export function fail(response: Response, status: number, code: string, message: string): void {
  response.status(status).json({ ok: false, error: { code, message } });
}

export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<void>,
) {
  return (request: Request, response: Response, next: NextFunction) => {
    void handler(request, response, next).catch(next);
  };
}

