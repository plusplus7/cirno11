export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export type PublishState = 'idle' | 'pending' | 'succeeded' | 'failed';

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary?: string;
  cover?: string;
  published: boolean;
}

export interface BlogPost {
  frontmatter: PostFrontmatter;
  body: string;
  path: string;
}

export interface PublicBlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary?: string;
  cover?: string;
  html: string;
}

export interface PhotoEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  published: boolean;
}

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  avatarUrl: string;
  enabled: boolean;
}

export type LabTool =
  | {
      id: string;
      name: string;
      imageUrl: string;
      kind: 'external';
      url: string;
      enabled: boolean;
    }
  | {
      id: string;
      name: string;
      imageUrl: string;
      kind: 'internal';
      route: string;
      enabled: boolean;
    };

export interface AboutContent {
  heading: string;
  intro: string;
  sections: {
    term: string;
    description: string;
  }[];
}

export interface SiteData {
  posts: PublicBlogPost[];
  photos: PhotoEntry[];
  labTools: LabTool[];
  friendLinks: FriendLink[];
  about: AboutContent;
  generatedAt: string;
}

export function isFriendLinkArray(value: unknown): value is FriendLink[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate.id === 'string'
      && typeof candidate.name === 'string'
      && typeof candidate.url === 'string'
      && typeof candidate.avatarUrl === 'string'
      && typeof candidate.enabled === 'boolean';
  });
}

export function isLabToolArray(value: unknown): value is LabTool[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== 'string') return false;
    if (typeof candidate.name !== 'string') return false;
    if (typeof candidate.imageUrl !== 'string') return false;
    if (typeof candidate.enabled !== 'boolean') return false;
    if (candidate.kind === 'external') return typeof candidate.url === 'string';
    if (candidate.kind === 'internal') return typeof candidate.route === 'string';
    return false;
  });
}

export interface PublishJob {
  id: string;
  state: PublishState;
  startedAt?: string;
  finishedAt?: string;
  releasePath?: string;
  error?: string;
}
