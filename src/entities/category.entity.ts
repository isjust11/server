import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CategoryType } from './category-type.entity';
import { FoodItem } from './food-item.entity';
import { Table } from './table.entity';
import { Reservation } from './reservation.entity';
import { Order } from './order.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({default:''})
  icon: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => CategoryType, (cat) => cat.categories)
  type: CategoryType;

  @OneToMany(() => FoodItem, foodItem => foodItem.foodCategory)
  foodItems: FoodItem[];

  @OneToMany(() => FoodItem, foodItem => foodItem.statusCategory)
  foodStatusItems: FoodItem[];

  @OneToMany(() => FoodItem, foodItem => foodItem.unitCategory)
  foodUnitItems: FoodItem[];

  @OneToMany(() => Table, table => table.tableType)
  tableType: Table[];

  @OneToMany(() => Table, table => table.tableStatus)
  tableStatus: Table[];

  @OneToMany(() => Table, table => table.tableArea)
  tableArea: Table[];

  @OneToMany(() => Reservation, res => res.reservationStatus)
  reservation: Reservation[];

  @OneToMany(() => Order, order => order.orderStatus)
  order: Order[];

  @Column()
  createDate: Date;
  
  @Column()
  createBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
