import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { Schema } from './entities/schema.entity';

@Injectable()
export class SchemaService {
  constructor(@InjectModel(Schema) private schemaModel: typeof Schema) {}

  create(createSchemaDto: CreateSchemaDto) {
    return this.schemaModel.create({
      name: createSchemaDto.name,
      version: createSchemaDto.version,
      json: JSON.stringify(createSchemaDto.json),
    });
  }

  findAll() {
    return this.schemaModel.findAll();
  }

  findOne(name: string, version: number) {
    return this.schemaModel.findOne({
      where: { name: name, version: version },
    });
  }

  remove(name: string, version: number) {
    return this.schemaModel.destroy({
      where: { name: name, version: version },
    });
  }
}
