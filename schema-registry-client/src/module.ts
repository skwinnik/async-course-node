import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import SchemaRegistryValidator from './registry';
import SchemaRegistryClient from './client';

@Module({})
export default class SchemaRegistryModule {
  static register(schemaRegistryUrl: string): DynamicModule {
    return {
      module: SchemaRegistryModule,
      imports: [HttpModule],
      providers: [
        { provide: 'SCHEMA_REGISTRY_URL', useValue: schemaRegistryUrl },
        SchemaRegistryValidator,
        SchemaRegistryClient,
      ],
      exports: [SchemaRegistryValidator],
    };
  }
}
