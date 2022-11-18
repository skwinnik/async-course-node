import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  createdAt: true,
  deletedAt: true,
})
export class Role extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id: number;

  @Column({ unique: true })
  name: string;
}
