import { TaskDto } from "../task/task.dto";
import { TransactionDto } from "../accounting/transaction.dto";

export interface MeView {
    user_id: number;
  
    user_name: string;
  
    user_version: number;
  
    tasks_preview: TaskDto[];
  
    transactions_preview: TransactionDto[];
  
    updated_at: Date;
}