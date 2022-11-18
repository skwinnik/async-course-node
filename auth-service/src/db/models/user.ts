import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column
  roleId: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column
  passwordHash: string;
}
