import { ApiProperty } from '@nestjs/swagger';

export class LoggedInDto {
  constructor(id: number, name: string, role: string, access_token: string) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.access_token = access_token;
  }

  @ApiProperty({ example: 'string', description: 'encrypted JWT payload' })
  access_token: string;

  @ApiProperty({ example: 1, description: 'user id' })
  id: number;

  @ApiProperty({ example: 'string', description: 'user name' })
  name: string;

  @ApiProperty({ example: 'string', description: 'user role' })
  role: string;
}
