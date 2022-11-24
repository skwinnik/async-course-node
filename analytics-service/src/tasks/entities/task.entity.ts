import { Column, DataType, Model, Table } from 'sequelize-typescript';
export enum TaskStatus {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
}
@Table
export class Task extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false,
    autoIncrementIdentity: false,
    allowNull: false,
  })
  id: number;

  @Column
  name: string;

  @Column
  userId: number;

  @Column({
    type: DataType.STRING,
  })
  taskStatus: TaskStatus;
}
