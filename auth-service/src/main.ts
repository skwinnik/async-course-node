import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SchemaRegistry } from "@skwinnik/schema-registry-client/registry.class";
import { UserCreatedV1Event, UserCreatedV1EventSchema } from './users/events/userCreated.v1.event';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Auth Service API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const schemaRegistry = app.get(SchemaRegistry);
  await schemaRegistry.register(UserCreatedV1Event.EVENT_NAME, UserCreatedV1Event.VERSION, UserCreatedV1EventSchema);

  await app.listen(3000);
}
bootstrap();
