import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { Request } from 'express';
import { TaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiBody({ type: CreateTaskDto })
  @HasRoles('admin', 'manager')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post('complete')
  @ApiBody({ type: CompleteTaskDto })
  @HasRoles('user')
  complete(@Body() completeTaskDto: CompleteTaskDto, @Req() req: Request) {
    if (!req.user?.id) throw new UnauthorizedException();
    return this.tasksService.complete(completeTaskDto, req.user.id);
  }

  @Get('/all/:userId')
  @ApiBody({ type: Array<TaskDto> })
  @HasRoles('user')
  async getAll(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    if (!req.user?.id) throw new UnauthorizedException();
    if (req.user.id !== userId) throw new UnauthorizedException();

    return (await this.tasksService.findAll({ where: { userId: userId } })).map(
      (t) => new TaskDto(t),
    );
  }
}
