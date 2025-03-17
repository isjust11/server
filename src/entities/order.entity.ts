import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';
import { Guest } from './guest.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  guestId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Guest)
  @JoinColumn({ name: 'guestId' })
  guest?: Guest;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 