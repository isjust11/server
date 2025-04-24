import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CategoryType } from './category-type.entity';
import { FoodItem } from './food-item.entity';

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

  @Column()
  createDate: Date;
  
  @Column()
  createBy: string;
}
