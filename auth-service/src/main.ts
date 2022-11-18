import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';
import {
  UserCreatedV1Event,
  UserCreatedV1EventSchema,
} from './users/events/userCreated.v1.event';
import {
  UserUpdatedV1Event,
  UserUpdatedV1EventSchema,
} from './users/events/userUpdated.v1.event';
import {
  UserDeletedV1Event,
  UserDeletedV1EventSchema,
} from './users/events/userDeleted.v1.event';
import {
  RoleCreatedV1Event,
  RoleCreatedV1EventSchema,
} from './roles/events/roleCreated.v1.event';
import {
  RoleUpdatedV1Event,
  RoleUpdatedV1EventSchema,
} from './roles/events/roleUpdated.v1.event';
import {
  RoleDeletedV1Event,
  RoleDeletedV1EventSchema,
} from './roles/events/roleDeleted.v1.event';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('The Auth Service API description')
    .setVersion('1.0')
    .addSecurity('ApiKeyAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addSecurityRequirements('ApiKeyAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const schemaRegistry = app.get(SchemaRegistry);
  await registerEvents(schemaRegistry);

  await app.listen(3000);
}
bootstrap();

function registerEvents(schemaRegistry: SchemaRegistry) {
  const promises = [
    schemaRegistry.register(
      UserCreatedV1Event.EVENT_NAME,
      UserCreatedV1Event.VERSION,
      UserCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      UserUpdatedV1Event.EVENT_NAME,
      UserUpdatedV1Event.VERSION,
      UserUpdatedV1EventSchema,
    ),
    schemaRegistry.register(
      UserDeletedV1Event.EVENT_NAME,
      UserDeletedV1Event.VERSION,
      UserDeletedV1EventSchema,
    ),

    schemaRegistry.register(
      RoleCreatedV1Event.EVENT_NAME,
      RoleCreatedV1Event.VERSION,
      RoleCreatedV1EventSchema,
    ),
    schemaRegistry.register(
      RoleUpdatedV1Event.EVENT_NAME,
      RoleUpdatedV1Event.VERSION,
      RoleUpdatedV1EventSchema,
    ),
    schemaRegistry.register(
      RoleDeletedV1Event.EVENT_NAME,
      RoleDeletedV1Event.VERSION,
      RoleDeletedV1EventSchema,
    ),
  ];

  return Promise.all(promises);
}
