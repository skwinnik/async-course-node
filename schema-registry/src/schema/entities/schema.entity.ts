import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  paranoid: true,
  updatedAt: false,
  createdAt: true,
})
export class Schema extends Model {
  @Column({
    primaryKey: true,
  })
  name: string;

  @Column({
    primaryKey: true,
  })
  version: number;

  @Column({
    type: DataType.TEXT
  })
  json: string;
}
