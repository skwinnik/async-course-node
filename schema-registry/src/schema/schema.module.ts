import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Schema } from './entities/schema.entity';

@Module({
  imports: [SequelizeModule.forFeature([Schema])],
  controllers: [SchemaController],
  providers: [SchemaService]
})
export class SchemaModule {}
