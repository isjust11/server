import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  qrCodeUrl?: string;
} 