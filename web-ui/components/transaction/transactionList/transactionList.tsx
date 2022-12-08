import { TransactionDto } from "@/types/accounting/transaction.dto";
import { NextPage } from "next";
import { useState } from "react";

interface IModel {
  transactions: TransactionDto[];
}
const TransactionList: NextPage<IModel> = (model) => {
  const [transactions, setTransactions] = useState<TransactionDto[]>(
    model.transactions
  );

  return (
    <div>
      <div className="flex flex-col gap-5 w-full">
        {transactions.map((task) => (
          <div
            key={task.id}
            className="flex flex-row w-full p-3 border rounded border-neutral-600"
          >
            <div className="flex-1">{task.id}</div>
            <div className="flex-1">{task.description}</div>
            <div className="flex-1">-${task.credit}</div>
            <div className="flex-1">${task.debit}</div>
            <div className="flex-1">{task.created_at}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TransactionList;
