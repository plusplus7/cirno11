import express from 'express';
import multer from 'multer';
import type { AppConfig } from '../config/env';
import { clearSessionCookie, createSessionToken, hasOwnerSession, requireOwner, setSessionCookie } from '../auth/session';
import type { ContentStore } from '../content/store';
import { renderMarkdown } from '../content/markdown';
import type { AboutContent, LabTool, PhotoEntry } from '../../shared/types';
import { isLabToolArray } from '../../shared/types';
import type { MediaStorage } from '../media/mediaStorage';
import type { PublishService } from '../publish/publishService';
import { asyncHandler, fail, ok } from './http';

const photoUploadMaxBytes = 100 * 1024 * 1024;
const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: photoUploadMaxBytes,
    files: 1,
  },
});

export class PhotoUploadError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function storeUploadedPhoto(file: Express.Multer.File | undefined, mediaStorage: MediaStorage) {
  if (!file) {
    throw new PhotoUploadError(400, 'PHOTO_FILE_REQUIRED', '请选择要上传的照片文件。');
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new PhotoUploadError(400, 'INVALID_PHOTO_TYPE', '照片上传只支持图片文件。');
  }

  return await mediaStorage.storePhoto({
    filename: file.originalname || 'photo.jpg',
    contentType: file.mimetype || 'image/jpeg',
    data: file.buffer,
  });
}

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value ?? '';
}

export function createAdminRouter(
  config: AppConfig,
  contentStore: ContentStore,
  mediaStorage: MediaStorage,
  publishService: PublishService,
): express.Router {
  const router = express.Router();
  const ownerOnly = requireOwner(config);

  router.get('/session', (request, response) => {
    ok(response, { authenticated: hasOwnerSession(request, config) });
  });

  router.post('/login', (request, response) => {
    if (request.body?.password !== config.adminPassword) {
      fail(response, 401, 'INVALID_CREDENTIALS', 'Invalid admin password');
      return;
    }

    setSessionCookie(response, createSessionToken(config));
    ok(response, { authenticated: true });
  });

  router.post('/logout', (_request, response) => {
    clearSessionCookie(response);
    ok(response, { authenticated: false });
  });

  router.use(ownerOnly);

  router.get('/posts', asyncHandler(async (_request, response) => {
    ok(response, await contentStore.listPosts());
  }));

  router.get('/posts/:slug', asyncHandler(async (request, response) => {
    const post = await contentStore.getPost(param(request.params.slug));
    if (!post) {
      fail(response, 404, 'POST_NOT_FOUND', 'Post not found');
      return;
    }

    ok(response, post);
  }));

  router.post('/posts', asyncHandler(async (request, response) => {
    ok(response, await contentStore.savePost(request.body));
  }));

  router.put('/posts/:slug', asyncHandler(async (request, response) => {
    await contentStore.deletePost(param(request.params.slug));
    ok(response, await contentStore.savePost(request.body));
  }));

  router.delete('/posts/:slug', asyncHandler(async (request, response) => {
    await contentStore.deletePost(param(request.params.slug));
    ok(response, { deleted: true });
  }));

  router.post('/preview/markdown', (request, response) => {
    ok(response, { html: renderMarkdown(String(request.body?.markdown ?? '')) });
  });

  router.get('/photos', asyncHandler(async (_request, response) => {
    ok(response, await contentStore.listPhotos());
  }));

  router.post('/photos/upload', photoUpload.single('photo'), asyncHandler(async (request, response) => {
    try {
      ok(response, await storeUploadedPhoto(request.file, mediaStorage));
    } catch (error) {
      if (error instanceof PhotoUploadError) {
        fail(response, error.status, error.code, error.message);
        return;
      }
      throw error;
    }
  }));

  router.put('/photos', asyncHandler(async (request, response) => {
    ok(response, await contentStore.savePhotos(request.body as PhotoEntry[]));
  }));

  router.get('/lab', asyncHandler(async (_request, response) => {
    ok(response, await contentStore.listLabTools());
  }));

  router.put('/lab', asyncHandler(async (request, response) => {
    if (!isLabToolArray(request.body)) {
      fail(response, 400, 'INVALID_LAB_TOOLS', '杂物间入口必须是数组，并且每一项都需要 id、name、imageUrl、kind、enabled，以及对应的 url 或 route。');
      return;
    }

    ok(response, await contentStore.saveLabTools(request.body as LabTool[]));
  }));

  router.get('/about', asyncHandler(async (_request, response) => {
    ok(response, await contentStore.getAbout());
  }));

  router.put('/about', asyncHandler(async (request, response) => {
    ok(response, await contentStore.saveAbout(request.body as AboutContent));
  }));

  router.post('/publish', asyncHandler(async (_request, response) => {
    ok(response, await publishService.start());
  }));

  router.get('/publish', (_request, response) => {
    ok(response, publishService.current());
  });

  return router;
}
