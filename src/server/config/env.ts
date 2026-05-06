import 'dotenv/config';
import path from 'node:path';
import process from 'node:process';

export interface AppConfig {
  port: number;
  adminPassword: string;
  sessionSecret: string;
  githubOwner?: string;
  githubRepo?: string;
  githubBranch: string;
  githubToken?: string;
  contentRoot: string;
  localMediaRoot: string;
  publicMediaBaseUrl: string;
  distRoot: string;
  releasesRoot: string;
  currentReleasePath: string;
  publicBaseUrl: string;
}

export function loadConfig(): AppConfig {
  const root = process.cwd();

  return {
    port: Number(process.env.PORT ?? 4000),
    adminPassword: process.env.ADMIN_PASSWORD ?? 'change-me',
    sessionSecret: process.env.SESSION_SECRET ?? 'dev-session-secret',
    githubOwner: process.env.GITHUB_OWNER,
    githubRepo: process.env.GITHUB_REPO,
    githubBranch: process.env.GITHUB_BRANCH ?? 'main',
    githubToken: process.env.GITHUB_TOKEN,
    contentRoot: process.env.CONTENT_ROOT ?? path.join(root, 'content'),
    localMediaRoot: process.env.LOCAL_MEDIA_ROOT ?? path.join(root, 'media'),
    publicMediaBaseUrl: process.env.PUBLIC_MEDIA_BASE_URL ?? '/media',
    distRoot: process.env.DIST_ROOT ?? path.join(root, 'dist'),
    releasesRoot: process.env.RELEASES_ROOT ?? path.join(root, 'releases'),
    currentReleasePath: process.env.CURRENT_RELEASE_PATH ?? path.join(root, 'current'),
    publicBaseUrl: process.env.PUBLIC_BASE_URL ?? 'http://localhost:3000',
  };
}

export function isGitHubConfigured(config: AppConfig): boolean {
  return Boolean(config.githubOwner && config.githubRepo && config.githubToken);
}
