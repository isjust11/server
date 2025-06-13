import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
import { IconType } from 'src/enums/icon-type.enum';
import { Category } from './category.entity';

@Entity()
export class Navigator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: null})
  icon: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  parentId?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  order?: number;

  @Column({
    type: 'enum',
    enum: IconType,
    default: null
  })
  iconType?: IconType;

  @Column({ default: 20 })
  iconSize: number;

  @Column({ default: '' })
  className?: string;

  @ManyToOne(() => Navigator, navigator => navigator.children, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Navigator;

  @OneToMany(() => Navigator, navigator => navigator.parent)
  children?: Navigator[];

  @ManyToOne(() => Category, category => category.navigator, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'navigatorTypeId' })
  navigatorType: Category;

  @Column({ nullable: true })
  navigatorTypeId: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


} 