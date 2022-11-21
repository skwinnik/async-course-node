import { ArgumentMetadata, Inject, Logger, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SchemaRegistry } from '@skwinnik/schema-registry-client/registry.class';

export class ValidationSchemaPipe<T> implements PipeTransform<any, Promise<T>> {
  private logger = new Logger(ValidationSchemaPipe.name);
  constructor(@Inject(SchemaRegistry) private schemaRegistry: SchemaRegistry) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('read ', value);
    if (!value) throw new RpcException('value is null');
    if (!value.payload) throw new RpcException('value.payload is null');

    const eventName = value.event_name;
    const eventVersion = value.event_version;

    try {
      const result = await this.schemaRegistry.deserialize<T>(
        eventName,
        eventVersion,
        value.payload,
      );
      return result;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
