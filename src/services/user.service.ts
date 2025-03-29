import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/auth.dto';
import { Role } from '../entities/role.entity';
import { UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async create(createUserDto: RegisterDto): Promise<User> {

    const user = this.userRepository.create({
      username: createUserDto.username,
      password: createUserDto.password,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      isAdmin: createUserDto.isAdmin || false,
      platformId: createUserDto.platformId,
      picture: createUserDto.picture,
      isGoogleUser: createUserDto.isGoogleUser || false,
      isFacebookUser: createUserDto.isFacebookUser || false,
      isAppleUser: createUserDto.isAppleUser || false,
      isWebsiteUser: createUserDto.isWebsiteUser || false,
      verificationToken: createUserDto.verificationToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (createUserDto.roleIds) {
      const roles = await this.roleRepository.find({
        where: {
          id: In(createUserDto.roleIds),
        },
      });
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }

    if (updateUserDto.fullName !== undefined) {
      user.fullName = updateUserDto.fullName;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.isAdmin !== undefined) {
      user.isAdmin = updateUserDto.isAdmin;
    }

    if (updateUserDto.platformId !== undefined) {

      user.platformId = updateUserDto.platformId;
    }

    if (updateUserDto.picture !== undefined) {
      user.picture = updateUserDto.picture;
    }

    if (updateUserDto.isGoogleUser !== undefined) {
      user.isGoogleUser = updateUserDto.isGoogleUser;
    }

    if (updateUserDto.isFacebookUser !== undefined) {
      user.isFacebookUser = updateUserDto.isFacebookUser;
    }

    if (updateUserDto.verificationToken !== undefined) {
      user.verificationToken = updateUserDto.verificationToken;
    }

    if (updateUserDto.isEmailVerified !== undefined) {
      user.isEmailVerified = updateUserDto.isEmailVerified;
    }

    user.updatedAt = new Date();

    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roleIds) },
      });
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy tài khoản với ID ${id}`);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { verificationToken: token } });
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