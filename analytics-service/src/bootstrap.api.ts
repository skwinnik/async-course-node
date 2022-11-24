import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { registerEvents } from './register.events';
import { Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function bootstrapApi() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  
  const config = new DocumentBuilder()
    .setTitle('Task Service')
    .setDescription('The Task Service API description')
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
          groupId: 'analytics-service',
        },
        subscribe: {
          topics: [new RegExp('user\..*'), new RegExp('role\..*'), new RegExp('task\..*'), new RegExp('transaction\..*'), new RegExp('transactionPeriod\..*')],
          fromBeginning: true,
        },
        autoCommit: true,
      },
    },
    { inheritAppConfig: true },
  );
}
