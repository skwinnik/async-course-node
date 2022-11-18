import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUser } from './requests/createUser';
import { UpdateUser } from './requests/updateUser';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'User ID', example: 1 })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
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

  @Post('/update')
  @ApiBody({ type: UpdateUser })
  async updateUser(@Body() user: UpdateUser) {
    return await this.usersService.update(
      user.id,
      user.name,
      user.roleId,
    );
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'User ID', example: 1 })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
