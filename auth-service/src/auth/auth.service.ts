import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoggedInDto } from './dto/jwt.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/models/user';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByName(name);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoggedInDto | null> {
    const user = await this.validateUser(loginDto.name, loginDto.password);
    if (!user) return null;

    const role = await this.rolesService.findOne(user.roleId);
    if (!role) return null;

    const access_token = await this.jwtService.signAsync({
      id: user.id,
      user_name: user.name,
      role_name: role.name,
    });
    return new LoggedInDto(user.id, user.name, role.name, access_token);
  }
}
