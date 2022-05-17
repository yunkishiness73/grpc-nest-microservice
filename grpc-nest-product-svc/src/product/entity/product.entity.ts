import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockDecreaseLog } from './stock-decrease-log.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
  })
  public name!: string;

  @Column({
    type: 'varchar',
  })
  public sku!: string;

  @Column({ type: 'varchar' })
  public stock!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  public price!: number;

  @OneToMany(
    () => StockDecreaseLog,
    (stockDecreaseLog) => stockDecreaseLog.product,
  )
  public stockDecreaseLogs: StockDecreaseLog[];
}
