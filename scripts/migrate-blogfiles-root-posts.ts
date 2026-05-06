import 'dotenv/config';
import matter from 'gray-matter';

interface TreeEntry {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

interface GitRef {
  object: {
    sha: string;
  };
}

interface GitCommit {
  sha: string;
  tree: {
    sha: string;
  };
}

interface GitTree {
  sha: string;
  tree: TreeEntry[];
  truncated: boolean;
}

interface GitBlob {
  content: string;
  encoding: 'base64';
}

const owner = requiredEnv('GITHUB_OWNER');
const repo = requiredEnv('GITHUB_REPO');
const branch = process.env.GITHUB_BRANCH ?? 'master';
const token = requiredEnv('GITHUB_TOKEN');
const apply = process.argv.includes('--apply');
const overwrite = process.argv.includes('--overwrite');
const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

const ref = await request<GitRef>(`/git/ref/heads/${branch}`);
const commit = await request<GitCommit>(`/git/commits/${ref.object.sha}`);
const tree = await request<GitTree>(`/git/trees/${commit.tree.sha}?recursive=1`);

if (tree.truncated) {
  throw new Error('Repository tree is truncated; refusing to migrate without a complete tree.');
}

const rootMarkdownFiles = tree.tree.filter(
  (entry) => entry.type === 'blob' && entry.path.endsWith('.md') && !entry.path.includes('/'),
);
const existingPostPaths = new Set(
  tree.tree.filter((entry) => entry.type === 'blob' && entry.path.startsWith('posts/')).map((entry) => entry.path),
);

if (rootMarkdownFiles.length === 0) {
  console.log('No root Markdown files to migrate.');
  process.exit(0);
}

const changes = await Promise.all(rootMarkdownFiles.map(async (entry) => {
  const targetPath = `posts/${entry.path}`;
  if (existingPostPaths.has(targetPath) && !overwrite) {
    throw new Error(`${targetPath} already exists. Re-run with --overwrite if that is intended.`);
  }

  const source = await readBlob(entry.sha);
  const { content, addedFields } = normalizePost(entry.path, source);
  return {
    sourcePath: entry.path,
    targetPath,
    sourceSha: entry.sha,
    content,
    addedFields,
  };
}));

console.log(`Repository: ${owner}/${repo}#${branch}`);
console.log(`Mode: ${apply ? 'apply' : 'dry-run'}`);
console.log(`Root Markdown files: ${changes.length}`);
for (const change of changes) {
  const fields = change.addedFields.length > 0 ? ` add ${change.addedFields.join(',')}` : ' no frontmatter additions';
  console.log(`- ${change.sourcePath} -> ${change.targetPath};${fields}`);
}

if (!apply) {
  console.log('Dry-run only. Re-run with --apply to create one migration commit.');
  process.exit(0);
}

const newTree = await request<{ sha: string }>('/git/trees', {
  method: 'POST',
  body: JSON.stringify({
    base_tree: commit.tree.sha,
    tree: changes.flatMap((change) => [
      {
        path: change.targetPath,
        mode: '100644',
        type: 'blob',
        content: change.content,
      },
      {
        path: change.sourcePath,
        mode: '100644',
        type: 'blob',
        sha: null,
      },
    ]),
  }),
});

const newCommit = await request<{ sha: string }>('/git/commits', {
  method: 'POST',
  body: JSON.stringify({
    message: 'Migrate root markdown posts into posts directory',
    tree: newTree.sha,
    parents: [ref.object.sha],
  }),
});

await request(`/git/refs/heads/${branch}`, {
  method: 'PATCH',
  body: JSON.stringify({
    sha: newCommit.sha,
  }),
});

console.log(`Migration commit created: ${newCommit.sha}`);

function normalizePost(filePath: string, source: string): { content: string; addedFields: string[] } {
  const parsed = matter(source);
  const data = { ...parsed.data } as Record<string, unknown>;
  const addedFields: string[] = [];

  if (!data.title) {
    data.title = slugFromFile(filePath);
    addedFields.push('title');
  }

  if (!data.slug) {
    data.slug = slugFromFile(filePath);
    addedFields.push('slug');
  }

  if (!data.date) {
    data.date = dateFromFile(filePath);
    addedFields.push('date');
  }

  if (!Array.isArray(data.tags)) {
    data.tags = [];
    addedFields.push('tags');
  }

  if (data.published === undefined) {
    data.published = true;
    addedFields.push('published');
  }

  return {
    content: matter.stringify(parsed.content.trimStart(), data),
    addedFields,
  };
}

function slugFromFile(filePath: string): string {
  return filePath.replace(/\.md$/, '');
}

function dateFromFile(filePath: string): string {
  const match = /^(\d{4})(?:[.-](\d{1,2}))?(?:[.-](\d{1,2}))?/.exec(filePath);
  if (!match) {
    return new Date().toISOString().slice(0, 10);
  }

  const [, year, month = '1', day = '1'] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function readBlob(sha: string): Promise<string> {
  const blob = await request<GitBlob>(`/git/blobs/${sha}`);
  return Buffer.from(blob.content, blob.encoding).toString('utf8');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${init.method ?? 'GET'} ${path} failed with ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}
