import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Me, MeSchema } from './schema/me.schema';
import { UserModule } from 'src/user/user.module';
import { TaskModule } from 'src/task/task.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Me.name, schema: MeSchema }]),
    UserModule,
    TaskModule,
    TransactionModule,
  ],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
