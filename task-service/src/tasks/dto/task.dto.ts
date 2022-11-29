import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class TaskDto {
  constructor(task: Task) {
    this.id = task.id;
    this.name = task.name;
    this.userId = task.userId;
    this.status = task.taskStatus.toString();
  }
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @ApiProperty({ example: 'Task title', description: 'Task title' })
  name: string;

  @ApiProperty({ example: 'User ID', description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 'Task status', description: 'Task status' })
  status: string;
}
