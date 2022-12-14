import { ApiProperty } from "@nestjs/swagger";

export class UpdateUser {
    @ApiProperty({ example: 1, description: 'User Id' })
    id: number;

    @ApiProperty({ example: 'admin', description: 'User name' })
    name: string;

    @ApiProperty({ example: '1', description: 'User role id' })
    roleId: number;
}