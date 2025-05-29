import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
import { IconType } from 'src/enums/icon-type.enum';

@Entity()
export class Navigator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
    default: IconType.lucid
  })
  iconType?: IconType;

  @Column({ default: 20 })
  iconSize: number;

  @Column()
  className: string;

  @ManyToOne(() => Navigator, navigator => navigator.children, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Navigator;

  @OneToMany(() => Navigator, navigator => navigator.parent)
  children?: Navigator[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'navigator_roles',
    joinColumn: {
      name: 'navigatorId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


} 