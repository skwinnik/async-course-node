import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { PublisherService } from './publisher/publisher.service';

export async function bootstrapPublisher() {
  const app = await NestFactory.create(AppModule);
  const service = app.get(PublisherService);
  app.enableShutdownHooks();

  const pollPromise = service.poll();
  await app.listen(3000);
  await pollPromise;
}

bootstrapPublisher();