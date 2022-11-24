import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { RoleCreatedV1Event } from './events/roleCreated.v1.event';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @EventPattern('role.created.v1')
  async createV1(
    @Body(ValidationSchemaPipe<RoleCreatedV1Event>) event: RoleCreatedV1Event,
  ) {
    await this.rolesService.create(event.id, event.name);
  }
}
