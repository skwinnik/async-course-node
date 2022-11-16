import { ApiProperty } from "@nestjs/swagger";

export class CreateRole {
  @ApiProperty({ example: 'admin', description: 'Role name' })
  name: string;
}
