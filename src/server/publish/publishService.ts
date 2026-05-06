import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import type { AppConfig } from '../config/env';
import type { PublishJob } from '../../shared/types';

function timestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

async function copyDirectory(from: string, to: string): Promise<void> {
  await fs.mkdir(to, { recursive: true });
  await fs.cp(from, to, { recursive: true });
}

async function switchSymlink(target: string, linkPath: string): Promise<void> {
  const tmp = `${linkPath}.next`;
  await fs.rm(tmp, { force: true, recursive: true });
  await fs.symlink(target, tmp, 'dir');
  await fs.rename(tmp, linkPath);
}

export class PublishService {
  private job: PublishJob = { id: 'initial', state: 'idle' };

  constructor(private readonly config: AppConfig) {}

  current(): PublishJob {
    return this.job;
  }

  async start(): Promise<PublishJob> {
    if (this.job.state === 'pending') {
      return this.job;
    }

    this.job = {
      id: timestamp(),
      state: 'pending',
      startedAt: new Date().toISOString(),
    };

    void this.run(this.job.id);
    return this.job;
  }

  private async run(jobId: string): Promise<void> {
    try {
      await runCommand('npm', ['run', 'build:static']);
      const releasePath = path.join(this.config.releasesRoot, jobId);
      await copyDirectory(this.config.distRoot, releasePath);
      await verifyRelease(releasePath);
      await fs.mkdir(path.dirname(this.config.currentReleasePath), { recursive: true });
      await switchSymlink(releasePath, this.config.currentReleasePath);
      this.job = { ...this.job, state: 'succeeded', finishedAt: new Date().toISOString(), releasePath };
    } catch (error) {
      this.job = {
        ...this.job,
        state: 'failed',
        finishedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export async function verifyRelease(releasePath: string): Promise<void> {
  const indexPath = path.join(releasePath, 'index.html');
  const stat = await fs.stat(indexPath).catch(() => undefined);
  if (!stat) {
    throw new Error(`Release is missing ${indexPath}`);
  }

  if (!stat.isFile()) {
    throw new Error(`Release is missing ${indexPath}`);
  }
}

async function runCommand(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}
