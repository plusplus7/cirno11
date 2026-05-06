import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { verifyRelease } from '../src/server/publish/publishService';

describe('publish release verification', () => {
  it('accepts a release with index.html', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'release-ok-'));
    await fs.writeFile(path.join(dir, 'index.html'), '<main></main>');
    await expect(verifyRelease(dir)).resolves.toBeUndefined();
  });

  it('rejects a release without index.html so the previous release can remain active', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'release-bad-'));
    await expect(verifyRelease(dir)).rejects.toThrow('missing');
  });
});

