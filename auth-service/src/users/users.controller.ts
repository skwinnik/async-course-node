import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { CreateUser } from './requests/createUser';
import { UpdateUser } from './requests/updateUser';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Public } from 'src/auth/guards/public.attribute';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @HasRoles('admin')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'User ID',
    example: 1,
  })
  async getUser(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    if (!req.user || req.user.id !== id)
      throw new HttpException('Forbidden', 403);
    return await this.usersService.findOne(id);
  }

  @Post('/create')
  @ApiBody({ type: CreateUser })
  @Public()
  async createUser(@Body() user: CreateUser) {
    return await this.usersService.create(
      user.name,
      user.password,
      user.roleId,
    );
  }

  @Post('/update')
  @ApiBody({ type: UpdateUser })
  async updateUser(@Req() req: Request, @Body() user: UpdateUser) {
    if (!req.user || req.user.id !== user.id)
      throw new HttpException('Forbidden', 403);
    return await this.usersService.update(user.id, user.name, user.roleId);
  }

  @HasRoles('admin')
  @Delete('/delete/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'User ID',
    example: 1,
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
