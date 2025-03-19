import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { username } = registerDto;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException(`Tài khoản ${username} đã tồn tại`);
    }
    
    // Créer un nouvel utilisateur
    const user = this.userRepository.create(registerDto);
    
    // Enregistrer le nouvel utilisateur dans la base de données
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }
    
    // Supprimer le mot de passe de l'objet mis à jour si présent pour éviter la mise à jour
    if (userData.password) {
      delete userData.password;
    }
    
    // Mettre à jour les propriétés utilisateur
    Object.assign(user, userData);
    
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }
    await this.userRepository.remove(user);
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }
    user.isBlocked = true;
    return this.userRepository.save(user);
  }

  async unblockUser(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }
    user.isBlocked = false;
    return this.userRepository.save(user);
  }
} 