export interface StoredMedia {
  id: string;
  url: string;
  path: string;
  thumbnailUrl: string;
  thumbnailPath: string;
}

export interface MediaStorage {
  storePhoto(input: { id?: string; filename: string; contentType: string; data: Buffer }): Promise<StoredMedia>;
  resolveUrl(idOrPath: string): string;
  delete(idOrPath: string): Promise<void>;
}
