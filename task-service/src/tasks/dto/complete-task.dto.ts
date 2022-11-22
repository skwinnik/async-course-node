import { ApiProperty } from '@nestjs/swagger';

export class CompleteTaskDto {
  @ApiProperty({ example: '1', description: 'Task ID' })
  id: number;
}
