import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
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

  @ManyToOne(() => Reservation, reservation => reservation.tableReservations)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;


  @Column({nullable: true})
  reservationId: number;

  @Column({nullable: true})
  areaId: string; // ID của khu vực bàn

  @Column({nullable: true})
  tableStatusId: string;

  @Column({nullable: true})
  tableTypeId: string;  

  @Column({default: true})
  isAvailable: boolean;  

  @Column({ nullable: true })
  description?: string;

} 

