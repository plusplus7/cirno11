import type { Request, Response } from 'express';
import { describe, expect, it } from 'vitest';
import { createSessionToken, hasOwnerSession, requireOwner } from '../src/server/auth/session';
import type { AppConfig } from '../src/server/config/env';
import { isLabToolArray } from '../src/shared/types';

const config: AppConfig = {
  port: 0,
  adminPassword: 'pw',
  sessionSecret: 'secret',
  githubBranch: 'main',
  contentRoot: 'content',
  localMediaRoot: 'media',
  publicMediaBaseUrl: '/media',
  distRoot: 'dist',
  releasesRoot: 'releases',
  currentReleasePath: 'current',
  publicBaseUrl: 'http://localhost:3000',
};

function responseMock() {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  return response as Response & { statusCode: number; body: unknown };
}

describe('admin API authentication', () => {
  it('rejects unauthenticated admin middleware calls', () => {
    const middleware = requireOwner(config);
    const response = responseMock();
    let nextCalled = false;

    middleware({ headers: {} } as Request, response, () => {
      nextCalled = true;
    });

    expect(response.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it('accepts valid owner session cookies', () => {
    const token = createSessionToken(config);
    const request = { headers: { cookie: `cirno11_session=${encodeURIComponent(token)}` } } as Request;

    expect(hasOwnerSession(request, config)).toBe(true);
  });
});

describe('lab metadata validation', () => {
  it('accepts valid lab tool arrays', () => {
    expect(isLabToolArray([
      {
        id: 'tool',
        name: 'Tool',
        imageUrl: '/tool.png',
        kind: 'external',
        url: 'https://example.com',
        enabled: true,
      },
    ])).toBe(true);
  });

  it('rejects non-array lab metadata', () => {
    expect(isLabToolArray({ heading: 'About', sections: [] })).toBe(false);
  });
});
