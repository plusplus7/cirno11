import type { Request, Response } from 'express';
import { describe, expect, it } from 'vitest';
import { createSessionToken, hasOwnerSession, requireOwner } from '../src/server/auth/session';
import type { AppConfig } from '../src/server/config/env';
import type { MediaStorage } from '../src/server/media/mediaStorage';
import { PhotoUploadError, storeUploadedPhoto } from '../src/server/routes/adminRoutes';
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

describe('photo upload API', () => {
  it('stores multipart upload files and returns original and thumbnail references', async () => {
    let storedInput: { filename: string; contentType: string; data: Buffer } | undefined;
    const mediaStorage: MediaStorage = {
      storePhoto: async (input) => {
        storedInput = input;
        return {
          id: 'photo-id',
          path: 'photos/photo-id.jpg',
          url: '/media/photos/photo-id.jpg',
          thumbnailPath: 'photos/thumbnails/photo-id.webp',
          thumbnailUrl: '/media/photos/thumbnails/photo-id.webp',
        };
      },
      resolveUrl: (idOrPath) => `/media/${idOrPath}`,
      delete: async () => undefined,
    };

    const result = await storeUploadedPhoto({
      fieldname: 'photo',
      originalname: 'sample.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: Buffer.byteLength('image-bytes'),
      buffer: Buffer.from('image-bytes'),
      destination: '',
      filename: '',
      path: '',
      stream: undefined as never,
    }, mediaStorage);

    expect(result).toEqual({
      id: 'photo-id',
      path: 'photos/photo-id.jpg',
      url: '/media/photos/photo-id.jpg',
      thumbnailPath: 'photos/thumbnails/photo-id.webp',
      thumbnailUrl: '/media/photos/thumbnails/photo-id.webp',
    });
    expect(storedInput?.filename).toBe('sample.jpg');
    expect(storedInput?.contentType).toBe('image/jpeg');
    expect(storedInput?.data.toString()).toBe('image-bytes');
  });

  it('rejects upload requests without a photo file', async () => {
    const mediaStorage: MediaStorage = {
      storePhoto: async () => {
        throw new Error('storePhoto should not be called');
      },
      resolveUrl: (idOrPath) => `/media/${idOrPath}`,
      delete: async () => undefined,
    };

    await expect(storeUploadedPhoto(undefined, mediaStorage)).rejects.toMatchObject({
      status: 400,
      code: 'PHOTO_FILE_REQUIRED',
      message: '请选择要上传的照片文件。',
    } satisfies Partial<PhotoUploadError>);
  });
});
