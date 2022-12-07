import { Body, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserCreatedV1Event } from '@skwinnik/schema-registry-events';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('user.created.v1')
  async createV1(
    @Body(ValidationSchemaPipe<UserCreatedV1Event>) event: UserCreatedV1Event,
  ) {
    await this.userService.create(event.id, event.name, event.version);
  }
}
