import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Outbox } from 'src/db/models/outbox';
import { Role } from 'src/db/models/role';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [SequelizeModule.forFeature([Role]), SequelizeModule.forFeature([Outbox])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
