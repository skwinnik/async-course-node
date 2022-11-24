import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TransactionPeriod extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  startedAt: Date;

  @Column({
    defaultValue: true,
  })
  isOpen: boolean;
}
