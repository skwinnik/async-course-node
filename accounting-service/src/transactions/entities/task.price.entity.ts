import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TaskPrice extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false,
    autoIncrementIdentity: false,
  })
  taskId: number;

  @Column
  fee: number;

  @Column
  reward: number;
}
