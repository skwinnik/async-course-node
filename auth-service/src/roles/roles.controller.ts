import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateRole } from './requests/createRole';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('/')
  async getAllRoles() {
    return await this.roleService.findAll();
  }

  @Post('/create')
  @ApiBody({ type: CreateRole })
  async createRole(@Body() role: CreateRole) {
    return await this.roleService.create(role.name);
  }
}
