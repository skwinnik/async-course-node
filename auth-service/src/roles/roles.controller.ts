import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { CreateRole } from './requests/createRole';
import { UpdateRole } from './requests/updateRole';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Roles')
@HasRoles('admin')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('/')
  async getAllRoles() {
    return await this.roleService.findAll();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Role ID', example: 1 })
  async getRole(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.findOne(id);
  }

  @Post('/create')
  @ApiBody({ type: CreateRole })
  async createRole(@Body() role: CreateRole) {
    return await this.roleService.create(role.name);
  }

  @Post('/update')
  @ApiBody({ type: UpdateRole })
  async updateRole(@Body() role: UpdateRole) {
    return await this.roleService.update(role.id, role.name);
  }

  @Delete('/delete/:id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Role ID', example: 1 })
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.delete(id);
  }
}
