import express from 'express';
import type { AppConfig } from './config/env';
import type { ContentStore } from './content/store';
import type { MediaStorage } from './media/mediaStorage';
import type { PublishService } from './publish/publishService';
import { createAdminRouter } from './routes/adminRoutes';
import { fail } from './routes/http';

export function createApp(
  config: AppConfig,
  contentStore: ContentStore,
  mediaStorage: MediaStorage,
  publishService: PublishService,
): express.Express {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use('/media', express.static(config.localMediaRoot));
  app.use('/api', createAdminRouter(config, contentStore, mediaStorage, publishService));

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof Error && error.name === 'MulterError') {
      const code = 'code' in error && typeof error.code === 'string' ? error.code : 'MULTIPART_ERROR';
      const status = code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      const message = code === 'LIMIT_FILE_SIZE'
        ? '照片文件过大，请上传 100MB 以内的图片。'
        : error.message;
      fail(response, status, code, message);
      return;
    }

    const message = error instanceof Error ? error.message : 'Unexpected server error';
    fail(response, 500, 'SERVER_ERROR', message);
  });

  return app;
}
