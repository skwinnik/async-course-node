import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  constructor(access_token: string) {
    this.access_token = access_token;
  }
  @ApiProperty({ example: 'string', description: 'encrypted JWT payload' })
  access_token: string;
}
