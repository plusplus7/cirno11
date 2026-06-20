import fs from 'node:fs/promises';
import path from 'node:path';
import { loadConfig } from '../src/server/config/env';
import { createContentStore } from '../src/server/content';
import { publishedPosts, toPublicPost } from '../src/server/content/markdown';
import type { SiteData } from '../src/shared/types';

const config = loadConfig();
const store = createContentStore(config);

const posts = publishedPosts(await store.listPosts()).map(toPublicPost);
const photos = (await store.listPhotos())
  .filter((photo) => photo.published)
  .sort((a, b) => b.date.localeCompare(a.date));
const labTools = (await store.listLabTools()).filter((tool) => tool.enabled);
const friendLinks = (await store.listFriendLinks()).filter((link) => link.enabled);
const about = await store.getAbout();

const siteData: SiteData = {
  posts,
  photos,
  labTools,
  friendLinks,
  about,
  generatedAt: new Date().toISOString(),
};

const outputPath = path.join(process.cwd(), 'src/client/generated/site-data.json');
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(siteData, null, 2)}\n`, 'utf8');
console.log(`Generated ${outputPath}`);
