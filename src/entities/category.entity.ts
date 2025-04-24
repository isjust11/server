import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CategoryType } from './category-type.entity';

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

  @Column()
  createDate: Date;
  
  @Column()
  createBy: string;
}
