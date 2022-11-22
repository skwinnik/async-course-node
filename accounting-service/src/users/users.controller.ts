import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { UserCreatedV1Event } from './events/userCreated.v1.event';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @EventPattern('user.created.v1')
  async createV1(
    @Body(ValidationSchemaPipe<UserCreatedV1Event>) event: UserCreatedV1Event,
  ) {
    await this.usersService.create(event.id, event.name, event.roleId);
  }
}
