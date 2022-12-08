import { INestApplication } from '@nestjs/common';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';

export async function createDefaultUsers(app: INestApplication) {
  const usersService = app.get(UsersService);
  const rolesService = app.get(RolesService);
  if ((await rolesService.findAll()).length === 0) {
    await rolesService.create('admin');
    await rolesService.create('user');
  }

  if ((await usersService.findAll()).length === 0) {
    const adminRole = (await rolesService.findAll()).find(
      (r) => r.name === 'admin',
    );
    const userRole = (await rolesService.findAll()).find(
      (r) => r.name === 'user',
    );

    if (adminRole) await usersService.create('admin', 'admin', adminRole.id);
    if (userRole) await usersService.create('user', 'user', userRole.id);
  }
}
