import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskService } from 'src/task/task.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { Me, MeDocument } from './schema/me.schema';

@Injectable()
export class MeService {
  private logger: Logger = new Logger(MeService.name);

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private transactionService: TransactionService,
    @InjectModel(Me.name)
    private meModel: Model<MeDocument>,
  ) {}

  async get(user_id: number): Promise<Me | null> {
    return this.meModel.findOne({ user_id }).exec();
  }

  async rebuild() {
    this.logger.log('Rebuilding Me view');
    const [users, tasks, transactions] = await Promise.all([
      this.userService.findAll(),
      this.taskService.findAll(),
      this.transactionService.findAll(),
    ]);

    this.logger.log(`Found ${users.length} users`);

    for (const user of users) {
      const userTasks = tasks.filter((task) => task.user_id === user.id);
      const userTransactions = transactions.filter(
        (transaction) => transaction.user_id === user.id,
      );

      let me = new Me();
      me.user_id = user.id;
      me.user_name = user.name;
      me.user_version = user.version;
      me.tasks_preview = userTasks
        .filter((t) => t.user_id === user.id)
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      me.transactions_preview = userTransactions
        .filter((t) => t.user_id === user.id)
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      me.updated_at = new Date();

      this.logger.log(`Rebuilding Me view for user ${user.id}...`)
      await this.meModel.findOneAndUpdate({ user_id: me.user_id }, me, {
        upsert: true,
      });
      this.logger.log(`Rebuilding Me view for user ${user.id}... done`)
    }
  }

  async onUserUpdated(
    user_id: number,
    { name, version }: { name: string; version: number },
  ) {
    await this.meModel.findOneAndUpdate(
      { user_id },
      { user_name: name, user_version: version, updated_at: new Date() },
      { upsert: true },
    );
  }

  async onTaskCreated(
    user_id: number,
    { id, name, status }: { id: number; name: string; status: string },
  ) {
    const user = await this.meModel.findOne({ user_id });

    if (!user) {
      this.logger.warn('User not found', user_id);
      return;
    }

    user.tasks_preview.push({ id, name, status, user_id });
    user.tasks_preview.sort((a, b) => b.id - a.id);
    user.tasks_preview = user.tasks_preview.slice(0, 3);
    user.updated_at = new Date();

    await user.save();
  }

  async onTransactionCreated(
    user_id: number,
    {
      id,
      transaction_period_id,
      description,
      created_at,
      credit,
      debit,
    }: {
      id: number;
      transaction_period_id: number;
      description: string;
      created_at: string | Date;
      credit: number;
      debit: number;
    },
  ) {
    const user = await this.meModel.findOne({ user_id });

    if (!user) {
      this.logger.warn('User not found', user_id);
      return;
    }

    user.transactions_preview.push({
      id,
      transaction_period_id,
      description,
      created_at: new Date(created_at),
      credit,
      debit,
      user_id,
    });
    user.transactions_preview.sort((a, b) => b.id - a.id);
    user.transactions_preview = user.transactions_preview.slice(0, 3);
    user.updated_at = new Date();

    await user.save();
  }
}
