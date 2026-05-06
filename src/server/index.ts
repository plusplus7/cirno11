import { createApp } from './app';
import { loadConfig } from './config/env';
import { createContentStore } from './content';
import { LocalMediaStorage } from './media/localMediaStorage';
import { PublishService } from './publish/publishService';

const config = loadConfig();
const contentStore = createContentStore(config);
const mediaStorage = new LocalMediaStorage(config.localMediaRoot, config.publicMediaBaseUrl);
const publishService = new PublishService(config);

createApp(config, contentStore, mediaStorage, publishService).listen(config.port, () => {
  console.log(`Cirno11 admin API listening on http://localhost:${config.port}`);
});

