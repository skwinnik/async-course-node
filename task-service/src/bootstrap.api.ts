import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';
import { registerEvents } from './register.events';
import { NestMicroservice, Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function bootstrapApi() {
  const app = await NestFactory.create(AppModule);
  NestMicroservice;
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
  configureMicroservice(app);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const schemaRegistry = app.get(SchemaRegistry);
  await registerEvents(schemaRegistry);

  app.startAllMicroservices();
  await app.listen(3000);
}

function configureMicroservice(app: INestApplication) {
  const config = app.get(ConfigService);
  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: config.get('KAFKA_CLIENT_ID'),
          brokers: [config.get('KAFKA_BROKER')],
        },
        consumer: {
          groupId: 'task-service',
        },
        subscribe: {
          //TODO change naming schema to user.created.v1
          topics: ['v1.userCreated'],
          fromBeginning: true,
        },
        autoCommit: true,
      },
    },
    { inheritAppConfig: true },
  );
}
