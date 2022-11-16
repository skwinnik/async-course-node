import { ApiResponseProperty } from '@nestjs/swagger';
import { Schema } from '../entities/schema.entity';

export class SchemaDto {
  @ApiResponseProperty({ example: 'TaskCreated' })
  name: string;

  @ApiResponseProperty({ example: 1 })
  version: number;

  @ApiResponseProperty({
    example: { type: 'object', properties: { id: { type: 'string' } } },
  })
  json: object;

  constructor(entity: Schema) {
    this.name = entity.name;
    this.version = entity.version;
    this.json = JSON.parse(entity.json);
  }
}
