import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ default: false })
  isGoogleUser: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 