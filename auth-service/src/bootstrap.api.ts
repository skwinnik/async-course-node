import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/dist/registry.class';
import { registerEvents } from './register.events';

export async function bootstrapApi() {
  const app = await NestFactory.create(AppModule);
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
