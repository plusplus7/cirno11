import type { AboutContent, ApiResult, BlogPost, FriendLink, LabTool, PhotoEntry, PublishJob } from '../shared/types';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
  });
  const result = (await response.json()) as ApiResult<T>;
  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export const api = {
  session: () => request<{ authenticated: boolean }>('/session'),
  login: (password: string) => request<{ authenticated: boolean }>('/login', { method: 'POST', body: JSON.stringify({ password }) }),
  posts: () => request<BlogPost[]>('/posts'),
  savePost: (post: BlogPost) => request<BlogPost>('/posts', { method: 'POST', body: JSON.stringify(post) }),
  deletePost: (slug: string) => request<{ deleted: boolean }>(`/posts/${slug}`, { method: 'DELETE' }),
  preview: (markdown: string) => request<{ html: string }>('/preview/markdown', { method: 'POST', body: JSON.stringify({ markdown }) }),
  photos: () => request<PhotoEntry[]>('/photos'),
  uploadPhoto: (file: File) => {
    const body = new FormData();
    body.append('photo', file);
    return request<{ id: string; url: string; path: string; thumbnailUrl: string; thumbnailPath: string }>('/photos/upload', { method: 'POST', body });
  },
  savePhotos: (photos: PhotoEntry[]) => request<PhotoEntry[]>('/photos', { method: 'PUT', body: JSON.stringify(photos) }),
  lab: () => request<LabTool[]>('/lab'),
  saveLab: (tools: LabTool[]) => request<LabTool[]>('/lab', { method: 'PUT', body: JSON.stringify(tools) }),
  friendLinks: () => request<FriendLink[]>('/friend-links'),
  saveFriendLinks: (links: FriendLink[]) => request<FriendLink[]>('/friend-links', { method: 'PUT', body: JSON.stringify(links) }),
  about: () => request<AboutContent>('/about'),
  saveAbout: (content: AboutContent) => request<AboutContent>('/about', { method: 'PUT', body: JSON.stringify(content) }),
  publish: () => request<PublishJob>('/publish', { method: 'POST' }),
  publishStatus: () => request<PublishJob>('/publish'),
};
