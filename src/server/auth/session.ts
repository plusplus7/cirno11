import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { AppConfig } from '../config/env';

const cookieName = 'cirno11_session';

function sign(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((cookie) => {
      const [key, ...value] = cookie.trim().split('=');
      return [key, decodeURIComponent(value.join('='))];
    }),
  );
}

export function createSessionToken(config: AppConfig): string {
  const payload = Buffer.from(JSON.stringify({ owner: true, createdAt: Date.now() }), 'utf8').toString('base64url');
  return `${payload}.${sign(payload, config.sessionSecret)}`;
}

export function isValidSessionToken(token: string | undefined, config: AppConfig): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  return Boolean(payload && signature && signature === sign(payload, config.sessionSecret));
}

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(cookieName, { path: '/' });
}

export function requireOwner(config: AppConfig) {
  return (request: Request, response: Response, next: NextFunction) => {
    const token = parseCookies(request.headers.cookie)[cookieName];
    if (!isValidSessionToken(token, config)) {
      response.status(401).json({ ok: false, error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
      return;
    }

    next();
  };
}

export function hasOwnerSession(request: Request, config: AppConfig): boolean {
  return isValidSessionToken(parseCookies(request.headers.cookie)[cookieName], config);
}

