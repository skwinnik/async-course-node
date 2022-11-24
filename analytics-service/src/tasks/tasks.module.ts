import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { TaskPrice } from 'src/tasks/entities/task.price.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, TaskPrice]),
    UsersModule,
    RolesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
