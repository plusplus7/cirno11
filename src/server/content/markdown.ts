import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import type { BlogPost, PostFrontmatter, PublicBlogPost } from '../../shared/types';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

interface SafeImage {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
}

const imagePlaceholderPrefix = 'CIRNO11_SAFE_IMAGE';

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseImageAttributes(input: string): SafeImage | undefined {
  const attributes: Record<string, string> = {};
  const pattern = /([A-Za-z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|“([^”]*)”|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    const name = match[1]?.toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? match[5] ?? '';
    if (name) {
      attributes[name] = value;
    }
  }

  const src = attributes.src?.trim();
  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: attributes.alt,
    width: /^\d+$/.test(attributes.width ?? '') ? attributes.width : undefined,
    height: /^\d+$/.test(attributes.height ?? '') ? attributes.height : undefined,
  };
}

function renderImage(image: SafeImage): string {
  const attributes = [
    `src="${escapeAttribute(image.src)}"`,
    `alt="${escapeAttribute(image.alt ?? '')}"`,
    image.width ? `width="${image.width}"` : undefined,
    image.height ? `height="${image.height}"` : undefined,
  ].filter(Boolean);

  return `<img ${attributes.join(' ')}>`;
}

function normalizeImageHtml(source: string): { source: string; images: SafeImage[] } {
  const images: SafeImage[] = [];
  const normalized = source.replace(/<img\b([^<>]*)\/?>/gi, (tag, attributes: string) => {
    const image = parseImageAttributes(attributes);
    if (!image) {
      return tag;
    }

    const index = images.push(image) - 1;
    return `${imagePlaceholderPrefix}_${index}`;
  });

  return { source: normalized, images };
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(String).filter(Boolean);
}

export function normalizeFrontmatter(data: Record<string, unknown>): PostFrontmatter {
  return {
    title: String(data.title ?? ''),
    slug: String(data.slug ?? ''),
    date: String(data.date ?? ''),
    tags: stringArray(data.tags),
    summary: data.summary ? String(data.summary) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    published: data.published === undefined ? true : Boolean(data.published),
  };
}

export function parsePostMarkdown(path: string, markdownSource: string): BlogPost {
  const parsed = matter(markdownSource);
  const frontmatter = normalizeFrontmatter(parsed.data);

  if (!frontmatter.slug) {
    const filename = path.split('/').pop() ?? path;
    frontmatter.slug = filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  }

  return {
    frontmatter,
    body: parsed.content.trim(),
    path,
  };
}

export function serializePostMarkdown(post: BlogPost): string {
  const frontmatter: Record<string, string | string[] | boolean> = {
    title: post.frontmatter.title,
    slug: post.frontmatter.slug,
    date: post.frontmatter.date,
    tags: post.frontmatter.tags,
    published: post.frontmatter.published,
  };

  if (post.frontmatter.summary) {
    frontmatter.summary = post.frontmatter.summary;
  }

  if (post.frontmatter.cover) {
    frontmatter.cover = post.frontmatter.cover;
  }

  return matter.stringify(`${post.body.trim()}\n`, frontmatter);
}

export function renderMarkdown(source: string): string {
  const normalized = normalizeImageHtml(source);
  let rendered = markdown.render(normalized.source);

  normalized.images.forEach((image, index) => {
    const placeholder = `${imagePlaceholderPrefix}_${index}`;
    rendered = rendered
      .replace(new RegExp(`<p>${placeholder}</p>`, 'g'), renderImage(image))
      .replace(new RegExp(placeholder, 'g'), renderImage(image));
  });

  return rendered;
}

export function toPublicPost(post: BlogPost): PublicBlogPost {
  return {
    title: post.frontmatter.title,
    slug: post.frontmatter.slug,
    date: post.frontmatter.date,
    tags: post.frontmatter.tags,
    summary: post.frontmatter.summary,
    cover: post.frontmatter.cover,
    html: renderMarkdown(post.body),
  };
}

export function publishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((post) => post.frontmatter.published)
    .sort(comparePostsByDateDesc);
}

export function comparePostsByDateDesc(a: BlogPost, b: BlogPost): number {
  return dateValue(b.frontmatter.date) - dateValue(a.frontmatter.date);
}

function dateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
