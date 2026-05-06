import https from 'node:https';
import type { AppConfig } from '../config/env';
import { defaultAboutContent } from '../../shared/defaultContent';
import type { AboutContent, BlogPost, LabTool, PhotoEntry } from '../../shared/types';
import { isLabToolArray } from '../../shared/types';
import { comparePostsByDateDesc, parsePostMarkdown, serializePostMarkdown } from './markdown';
import { ContentStoreError, type ContentStore } from './store';

interface GitHubContentResponse {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  content?: string;
  encoding?: string;
}

interface HttpJsonResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

function normalizeHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
}

async function requestJson(url: string, init: RequestInit): Promise<HttpJsonResponse> {
  if (typeof fetch === 'function') {
    return fetch(url, init);
  }

  return new Promise<HttpJsonResponse>((resolve, reject) => {
    const body = typeof init.body === 'string' ? init.body : undefined;
    const request = https.request(url, {
      method: init.method ?? 'GET',
      headers: {
        ...normalizeHeaders(init.headers),
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {}),
      },
    }, (response) => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve({
          ok: Boolean(response.statusCode && response.statusCode >= 200 && response.statusCode < 300),
          status: response.statusCode ?? 0,
          async json() {
            return text ? JSON.parse(text) : undefined;
          },
        });
      });
    });

    request.on('error', reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

export class GitHubContentStore implements ContentStore {
  private readonly apiBase: string;

  constructor(private readonly config: AppConfig) {
    if (!config.githubOwner || !config.githubRepo || !config.githubToken) {
      throw new ContentStoreError('GitHub content store requires GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN');
    }

    this.apiBase = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}`;
  }

  async listPosts(): Promise<BlogPost[]> {
    const files = await this.listPostFiles();
    const posts = await Promise.all(
      files
        .filter((file) => file.type === 'file' && file.name.endsWith('.md'))
        .map(async (file) => parsePostMarkdown(file.path, await this.readFile(file.path))),
    );

    return posts.sort(comparePostsByDateDesc);
  }

  async getPost(slug: string): Promise<BlogPost | undefined> {
    return (await this.listPosts()).find((post) => post.frontmatter.slug === slug);
  }

  async savePost(post: BlogPost): Promise<BlogPost> {
    const path = `posts/${post.frontmatter.date}-${post.frontmatter.slug}.md`;
    const storedPost = { ...post, path };
    await this.writeFile(path, serializePostMarkdown(storedPost), `Save post: ${post.frontmatter.title}`);
    return storedPost;
  }

  async deletePost(slug: string): Promise<void> {
    const post = await this.getPost(slug);
    if (!post) {
      return;
    }

    const existing = await this.getContent(post.path);
    await this.request(`/contents/${post.path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete post: ${post.frontmatter.title}`,
        sha: existing.sha,
        branch: this.config.githubBranch,
      }),
    });
  }

  async listPhotos(): Promise<PhotoEntry[]> {
    return this.readJson<PhotoEntry[]>('data/photos.json', []);
  }

  async savePhotos(photos: PhotoEntry[]): Promise<PhotoEntry[]> {
    await this.writeJson('data/photos.json', photos, 'Update photography metadata');
    return photos;
  }

  async listLabTools(): Promise<LabTool[]> {
    const value = await this.readJson<unknown>('data/lab.json', []);
    return isLabToolArray(value) ? value : [];
  }

  async saveLabTools(tools: LabTool[]): Promise<LabTool[]> {
    await this.writeJson('data/lab.json', tools, 'Update lab metadata');
    return tools;
  }

  async getAbout(): Promise<AboutContent> {
    return this.readJson<AboutContent>('data/about.json', defaultAboutContent);
  }

  async saveAbout(content: AboutContent): Promise<AboutContent> {
    await this.writeJson('data/about.json', content, 'Update about profile');
    return content;
  }

  private async readJson<T>(path: string, fallback: T): Promise<T> {
    try {
      return JSON.parse(await this.readFile(path)) as T;
    } catch (error) {
      if (error instanceof ContentStoreError && error.code === 'GITHUB_NOT_FOUND') {
        return fallback;
      }

      throw error;
    }
  }

  private async listPostFiles(): Promise<GitHubContentResponse[]> {
    const postsDir = await this.request<GitHubContentResponse[]>('/contents/posts').catch((error: unknown) => {
      if (error instanceof ContentStoreError && error.code === 'GITHUB_NOT_FOUND') {
        return undefined;
      }

      throw error;
    });

    if (postsDir) {
      return postsDir;
    }

    const root = await this.request<GitHubContentResponse[]>('/contents');
    return root.filter((file) => file.type === 'file' && file.name.endsWith('.md'));
  }

  private async writeJson(path: string, value: unknown, message: string): Promise<void> {
    await this.writeFile(path, `${JSON.stringify(value, null, 2)}\n`, message);
  }

  private async readFile(path: string): Promise<string> {
    const file = await this.getContent(path);
    if (!file.content) {
      return '';
    }

    return Buffer.from(file.content, 'base64').toString('utf8');
  }

  private async writeFile(path: string, content: string, message: string): Promise<void> {
    const existing = await this.getContent(path).catch((error: unknown) => {
      if (error instanceof ContentStoreError && error.code === 'GITHUB_NOT_FOUND') {
        return undefined;
      }

      throw error;
    });

    await this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf8').toString('base64'),
        branch: this.config.githubBranch,
        sha: existing?.sha,
      }),
    });
  }

  private async getContent(path: string): Promise<GitHubContentResponse> {
    return this.request<GitHubContentResponse>(`/contents/${path}`);
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await requestJson(`${this.apiBase}${path}?ref=${this.config.githubBranch}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.config.githubToken}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...init.headers,
      },
    });

    if (!response.ok) {
      const code = response.status === 404 ? 'GITHUB_NOT_FOUND' : 'GITHUB_WRITE_FAILED';
      throw new ContentStoreError(`GitHub request failed with ${response.status}`, code);
    }

    return await response.json() as T;
  }
}
