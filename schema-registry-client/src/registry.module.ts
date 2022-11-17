import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchemaRegistry } from './registry.class';

@Module({})
export class SchemaRegistryModule {
  static forRoot(schemaRegistryUrl: string): DynamicModule {
    return {
      module: SchemaRegistryModule,
      imports: [HttpModule],
      providers: [
        { provide: 'SCHEMA_REGISTRY_URL', useValue: schemaRegistryUrl },
        SchemaRegistry,
      ],
      exports: [SchemaRegistry],
    };
  }
}
