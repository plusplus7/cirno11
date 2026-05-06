import type { AppConfig } from '../config/env';
import { isGitHubConfigured } from '../config/env';
import { FileContentStore } from './fileContentStore';
import { GitHubContentStore } from './githubContentStore';
import type { ContentStore } from './store';

export function createContentStore(config: AppConfig): ContentStore {
  if (isGitHubConfigured(config)) {
    return new GitHubContentStore(config);
  }

  return new FileContentStore(config.contentRoot);
}

