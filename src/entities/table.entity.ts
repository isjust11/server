import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string; // URL của hình ảnh bàn

  // Số lượng ghế ngồi
  @Column()
  capacity: number;

  @ManyToOne(() => Category, category => category.tableType)
  @JoinColumn({ name: 'tableTypeId' })
  tableType: Category;

  @ManyToOne(() => Category, category => category.tableStatus)
  @JoinColumn({ name: 'tableStatusId' })
  tableStatus: Category;

  @ManyToOne(() => Category, category => category.tableArea)
  @JoinColumn({ name: 'areaId' })
  tableArea: Category;

  @Column()
  areaId: string; // ID của khu vực bàn

  @Column()
  tableStatusId: string;

  @Column()
  tableTypeId: string;  

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  qrCodeUrl?: string;
} 

