import fs from 'node:fs/promises';
import path from 'node:path';
import { defaultAboutContent } from '../../shared/defaultContent';
import type { AboutContent, BlogPost, FriendLink, LabTool, PhotoEntry } from '../../shared/types';
import { isFriendLinkArray, isLabToolArray } from '../../shared/types';
import { comparePostsByDateDesc, parsePostMarkdown, serializePostMarkdown } from './markdown';
import type { ContentStore } from './store';

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallback;
    }

    throw error;
  }
}

async function writeJson<T>(filePath: string, value: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export class FileContentStore implements ContentStore {
  private readonly postsDir: string;
  private readonly dataDir: string;

  constructor(private readonly root: string) {
    this.postsDir = path.join(root, 'posts');
    this.dataDir = path.join(root, 'data');
  }

  async listPosts(): Promise<BlogPost[]> {
    await fs.mkdir(this.postsDir, { recursive: true });
    const entries = await fs.readdir(this.postsDir, { withFileTypes: true });
    const posts = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map(async (entry) => {
          const postPath = `posts/${entry.name}`;
          return parsePostMarkdown(postPath, await fs.readFile(path.join(this.postsDir, entry.name), 'utf8'));
        }),
    );

    return posts.sort(comparePostsByDateDesc);
  }

  async getPost(slug: string): Promise<BlogPost | undefined> {
    return (await this.listPosts()).find((post) => post.frontmatter.slug === slug);
  }

  async savePost(post: BlogPost): Promise<BlogPost> {
    const filename = `${post.frontmatter.slug}.md`;
    const postPath = `posts/${filename}`;
    const storedPost = { ...post, path: postPath };
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.writeFile(path.join(this.postsDir, filename), serializePostMarkdown(storedPost), 'utf8');
    return storedPost;
  }

  async deletePost(slug: string): Promise<void> {
    const post = await this.getPost(slug);
    if (!post) {
      return;
    }

    await fs.rm(path.join(this.root, post.path), { force: true });
  }

  async listPhotos(): Promise<PhotoEntry[]> {
    return readJson<PhotoEntry[]>(path.join(this.dataDir, 'photos.json'), []);
  }

  async savePhotos(photos: PhotoEntry[]): Promise<PhotoEntry[]> {
    await writeJson(path.join(this.dataDir, 'photos.json'), photos);
    return photos;
  }

  async listLabTools(): Promise<LabTool[]> {
    const value = await readJson<unknown>(path.join(this.dataDir, 'lab.json'), []);
    return isLabToolArray(value) ? value : [];
  }

  async saveLabTools(tools: LabTool[]): Promise<LabTool[]> {
    await writeJson(path.join(this.dataDir, 'lab.json'), tools);
    return tools;
  }

  async listFriendLinks(): Promise<FriendLink[]> {
    const value = await readJson<unknown>(path.join(this.dataDir, 'friend-links.json'), []);
    return isFriendLinkArray(value) ? value : [];
  }

  async saveFriendLinks(links: FriendLink[]): Promise<FriendLink[]> {
    await writeJson(path.join(this.dataDir, 'friend-links.json'), links);
    return links;
  }

  async getAbout(): Promise<AboutContent> {
    return readJson<AboutContent>(path.join(this.dataDir, 'about.json'), defaultAboutContent);
  }

  async saveAbout(content: AboutContent): Promise<AboutContent> {
    await writeJson(path.join(this.dataDir, 'about.json'), content);
    return content;
  }
}
