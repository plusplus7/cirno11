import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { MediaStorage, StoredMedia } from './mediaStorage';

const thumbnailMaxSize = 800;
const thumbnailQuality = 80;

function safeExtension(filename: string, contentType: string): string {
  const fromName = path.extname(filename).toLowerCase();
  if (fromName && /^[a-z0-9.]+$/.test(fromName)) {
    return fromName;
  }

  if (contentType === 'image/png') return '.png';
  if (contentType === 'image/webp') return '.webp';
  return '.jpg';
}

export class LocalMediaStorage implements MediaStorage {
  constructor(
    private readonly root: string,
    private readonly publicBaseUrl: string,
  ) {}

  async storePhoto(input: { id?: string; filename: string; contentType: string; data: Buffer }): Promise<StoredMedia> {
    const id = input.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const relativePath = `photos/${id}${safeExtension(input.filename, input.contentType)}`;
    const thumbnailPath = `photos/thumbnails/${id}.webp`;
    const absolutePath = path.join(this.root, relativePath);
    const absoluteThumbnailPath = path.join(this.root, thumbnailPath);
    const thumbnail = await sharp(input.data)
      .rotate()
      .resize({
        width: thumbnailMaxSize,
        height: thumbnailMaxSize,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: thumbnailQuality })
      .toBuffer();

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.mkdir(path.dirname(absoluteThumbnailPath), { recursive: true });
    await fs.writeFile(absolutePath, input.data);
    await fs.writeFile(absoluteThumbnailPath, thumbnail);

    return {
      id,
      path: relativePath,
      url: this.resolveUrl(relativePath),
      thumbnailPath,
      thumbnailUrl: this.resolveUrl(thumbnailPath),
    };
  }

  resolveUrl(idOrPath: string): string {
    const normalized = idOrPath.replace(/^\/+/, '');
    return `${this.publicBaseUrl.replace(/\/$/, '')}/${normalized}`;
  }

  async delete(idOrPath: string): Promise<void> {
    await fs.rm(path.join(this.root, idOrPath.replace(/^\/+/, '')), { force: true });
  }
}
