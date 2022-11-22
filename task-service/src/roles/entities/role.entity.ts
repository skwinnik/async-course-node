import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Role extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false,
    autoIncrementIdentity: false,
  })
  id: number;

  @Column({
    unique: true,
  })
  name: string;
}
