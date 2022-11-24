import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Transaction extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  transactionPeriodId: number;

  @Column
  taskId?: number;

  @Column
  userId: number;

  @Column
  description: string;

  @Column
  createdAt: Date;

  @Column({
    defaultValue: 0,
    allowNull: false,
  })
  credit: number;

  @Column({
    defaultValue: 0,
    allowNull: false,
  })
  debit: number;
}
