import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task 1', description: 'Task title' })
  name: string;
}
