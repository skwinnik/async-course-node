import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function bootstrapApi() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  
  const config = new DocumentBuilder()
    .setTitle('View Service')
    .setDescription('The View Service API description')
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
          groupId: 'view-service',
        },
        subscribe: {
          topics: [new RegExp('user\..*'), new RegExp('role\..*'), new RegExp('task\..*'), new RegExp('transaction\..*')],
          fromBeginning: true,
        },
        autoCommit: true,
      },
    },
    { inheritAppConfig: true },
  );
}
