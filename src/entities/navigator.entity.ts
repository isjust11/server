import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => Navigator, navigator => navigator.children)
  @JoinColumn({ name: 'parentId' })
  parent?: Navigator;

  @OneToMany(() => Navigator, navigator => navigator.parent)
  children?: Navigator[];
} 