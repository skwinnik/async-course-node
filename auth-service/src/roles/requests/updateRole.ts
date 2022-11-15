import { ApiProperty } from "@nestjs/swagger";

export class UpdateRole {
  @ApiProperty({ example: 1, description: 'Role Id' })
  id: number;
  
  @ApiProperty({ example: 'admin', description: 'Role name' })
  name: string;
}
