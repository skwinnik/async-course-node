import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';

import { PublisherService } from './publisher/publisher.service';
import { registerEvents } from './register.events';

export async function bootstrapPublisher() {
  const app = await NestFactory.create(AppModule);
  const schemaRegistry = app.get(SchemaRegistry);
  await registerEvents(schemaRegistry);

  const service = app.get(PublisherService);
  app.enableShutdownHooks();

  const pollPromise = service.poll();
  await app.listen(3001);
  await pollPromise;
}
