import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'admin', description: 'Username' })
    name: string;

    @ApiProperty({ example: 'admin', description: 'Password' })
    password: string;
}