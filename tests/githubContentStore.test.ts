import { describe, expect, it, vi } from 'vitest';
import { GitHubContentStore } from '../src/server/content/githubContentStore';

const config = {
  port: 4000,
  adminPassword: 'pw',
  sessionSecret: 'secret',
  githubOwner: 'owner',
  githubRepo: 'repo',
  githubBranch: 'main',
  githubToken: 'token',
  contentRoot: 'content',
  localMediaRoot: 'media',
  publicMediaBaseUrl: '/media',
  distRoot: 'dist',
  releasesRoot: 'releases',
  currentReleasePath: 'current',
  publicBaseUrl: 'http://localhost:3000',
};

describe('GitHubContentStore', () => {
  it('commits a post file', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const store = new GitHubContentStore(config);
    await store.savePost({
      path: '',
      frontmatter: { title: 'Hello', slug: 'hello', date: '2026-05-05', tags: [], published: true },
      body: 'Body',
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).message).toContain('Save post');
    vi.unstubAllGlobals();
  });

  it('reports write failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    const store = new GitHubContentStore(config);

    await expect(store.savePhotos([])).rejects.toThrow('GitHub request failed');
    vi.unstubAllGlobals();
  });

  it('commits about profile content', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const store = new GitHubContentStore(config);
    await store.saveAbout({
      heading: 'About',
      intro: 'Intro',
      sections: [{ term: 'Tech', description: 'Backend and frontend.' }],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).message).toContain('Update about profile');
    vi.unstubAllGlobals();
  });

  it('commits friend link metadata', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const store = new GitHubContentStore(config);
    await store.saveFriendLinks([
      {
        id: 'friend',
        name: 'Friend Site',
        url: 'https://example.com',
        avatarUrl: 'https://example.com/avatar.png',
        enabled: true,
      },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).message).toContain('Update friend link metadata');
    vi.unstubAllGlobals();
  });
});
