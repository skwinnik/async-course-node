import { ApiProperty } from "@nestjs/swagger";

export class CreateUser {
    @ApiProperty({ example: 'admin', description: 'User name' })
    name: string;

    @ApiProperty({ example: 'admin', description: 'User password' })
    password: string;

    @ApiProperty({ example: '1', description: 'User role id' })
    roleId: number;
}