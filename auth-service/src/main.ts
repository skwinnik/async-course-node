import { bootstrapApi } from './bootstrap.api';
import { bootstrapPublisher } from './bootstrap.publisher';

const mode = (process.env.APP_MODE || 'api').toLowerCase();

if (mode === 'api') bootstrapApi();
else if (mode === 'publisher') bootstrapPublisher();
else throw new Error('Unknown APP_MODE: ' + mode);
