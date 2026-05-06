import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { LocalMediaStorage } from '../src/server/media/localMediaStorage';

describe('LocalMediaStorage', () => {
  it('preserves original photo uploads and writes a generated thumbnail', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cirno11-media-'));
    const storage = new LocalMediaStorage(root, '/media');
    const data = await sharp({
      create: {
        width: 1200,
        height: 900,
        channels: 3,
        background: '#6aa6a0',
      },
    }).jpeg().toBuffer();

    const stored = await storage.storePhoto({
      id: 'sample-photo',
      filename: 'sample.jpg',
      contentType: 'image/jpeg',
      data,
    });

    expect(stored).toEqual({
      id: 'sample-photo',
      path: 'photos/sample-photo.jpg',
      url: '/media/photos/sample-photo.jpg',
      thumbnailPath: 'photos/thumbnails/sample-photo.webp',
      thumbnailUrl: '/media/photos/thumbnails/sample-photo.webp',
    });
    const originalStat = await fs.stat(path.join(root, stored.path));
    const thumbnailStat = await fs.stat(path.join(root, stored.thumbnailPath));
    expect(originalStat.isFile()).toBe(true);
    expect(thumbnailStat.isFile()).toBe(true);

    const thumbnailMetadata = await sharp(path.join(root, stored.thumbnailPath)).metadata();
    expect(thumbnailMetadata.format).toBe('webp');
    expect(Math.max(thumbnailMetadata.width ?? 0, thumbnailMetadata.height ?? 0)).toBeLessThanOrEqual(800);
  });
});
