import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchemaService } from './schema.service';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SchemaDto } from './dto/schema.dto';

@Controller('schema')
@ApiTags('Schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  @ApiBody({ type: CreateSchemaDto })
  async create(@Body() createSchemaDto: CreateSchemaDto) {
    return new SchemaDto(await this.schemaService.create(createSchemaDto));
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Schema records',
    type: [SchemaDto],
  })
  async findAll() {
    const list = await this.schemaService.findAll();
    return list.map((item) => new SchemaDto(item));
  }

  @Get(':name/:version')
  @ApiParam({ name: 'name', required: true })
  @ApiParam({ name: 'version', required: true })
  @ApiResponse({ status: 200, description: 'Schema record', type: SchemaDto })
  async findOne(
    @Param('name') name: string,
    @Param('version') version: number,
  ) {
    return new SchemaDto(await this.schemaService.findOne(name, +version));
  }

  @Delete(':name/:version')
  @ApiParam({ name: 'name', required: true })
  @ApiParam({ name: 'version', required: true })
  remove(@Param('name') name: string, @Param('version') version: number) {
    return this.schemaService.remove(name, +version);
  }
}
