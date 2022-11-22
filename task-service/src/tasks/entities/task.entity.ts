import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Task extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  name: string;

  @Column
  userId: number;
}
