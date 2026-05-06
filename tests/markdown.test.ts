import { describe, expect, it } from 'vitest';
import { parsePostMarkdown, publishedPosts, renderMarkdown, serializePostMarkdown } from '../src/server/content/markdown';

describe('markdown posts', () => {
  it('parses and serializes frontmatter', () => {
    const post = parsePostMarkdown('posts/2026-05-05-hello.md', `---
title: Hello
slug: hello
date: "2026-05-05"
tags:
  - react
published: true
---

# Body
`);

    expect(post.frontmatter.slug).toBe('hello');
    expect(post.frontmatter.tags).toEqual(['react']);
    expect(serializePostMarkdown(post)).toContain('title: Hello');
  });

  it('filters drafts from published posts', () => {
    const published = parsePostMarkdown('posts/a.md', '---\ntitle: A\nslug: a\ndate: "2026-01-02"\npublished: true\n---\nA');
    const draft = parsePostMarkdown('posts/b.md', '---\ntitle: B\nslug: b\ndate: "2026-01-03"\npublished: false\n---\nB');

    expect(publishedPosts([draft, published])).toEqual([published]);
  });

  it('renders markdown without raw html execution', () => {
    expect(renderMarkdown('<script>alert(1)</script>')).not.toContain('<script>');
  });

  it('renders safe image html tags from markdown', () => {
    const html = renderMarkdown('<img src="https://example.com/a.jpg" alt="A photo" width=800 />');

    expect(html).toContain('<img src="https://example.com/a.jpg" alt="A photo" width="800">');
  });

  it('renders image html tags with curly quotes', () => {
    const html = renderMarkdown('<img src=“https://example.com/a.jpg” width=800 />');

    expect(html).toContain('<img src="https://example.com/a.jpg" alt="" width="800">');
  });

  it('does not preserve unsafe image html attributes', () => {
    const html = renderMarkdown('<img src="x.jpg" onerror="alert(1)" style="width: 100vw" />');

    expect(html).toContain('<img src="x.jpg" alt="">');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('style=');
  });
});
