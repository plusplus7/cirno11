import type { AboutContent, BlogPost, LabTool, PhotoEntry } from '../../shared/types';

export interface ContentStore {
  listPosts(): Promise<BlogPost[]>;
  getPost(slug: string): Promise<BlogPost | undefined>;
  savePost(post: BlogPost): Promise<BlogPost>;
  deletePost(slug: string): Promise<void>;
  listPhotos(): Promise<PhotoEntry[]>;
  savePhotos(photos: PhotoEntry[]): Promise<PhotoEntry[]>;
  listLabTools(): Promise<LabTool[]>;
  saveLabTools(tools: LabTool[]): Promise<LabTool[]>;
  getAbout(): Promise<AboutContent>;
  saveAbout(content: AboutContent): Promise<AboutContent>;
}

export class ContentStoreError extends Error {
  constructor(
    message: string,
    public readonly code = 'CONTENT_STORE_ERROR',
  ) {
    super(message);
  }
}
