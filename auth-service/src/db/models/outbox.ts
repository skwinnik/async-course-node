import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: "Outbox",
  paranoid: true,
  createdAt: true,
  deletedAt: true,
})
export class Outbox extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({ allowNull: false })
  eventName: string;

  @Column({ allowNull: false })
  eventVersion: number;

  @Column({ allowNull: false })
  payload: string;

  @Column({ type: DataType.DATE, allowNull: true })
  sentAt: Date;
}
