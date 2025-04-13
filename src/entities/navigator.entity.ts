import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

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

  @ManyToOne(() => Navigator, navigator => navigator.children)
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
} 