import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUser } from './requests/createUser';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Post('/create')
  @ApiBody({ type: CreateUser })
  async createUser(@Body() user: CreateUser) {
    return await this.usersService.create(
      user.name,
      user.password,
      user.roleId,
    );
  }
}
