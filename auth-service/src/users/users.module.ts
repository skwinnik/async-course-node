import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/db/models/user';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Outbox } from 'src/db/models/outbox';

@Module({
  imports: [SequelizeModule.forFeature([User]), SequelizeModule.forFeature([Outbox])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
