import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { Permission } from '../entities/permission.entity';
import { Navigator } from '../entities/navigator.entity';
import { AssignNavigatorDto } from '../dtos/assign-navigator.dto';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Navigator)
    private navigatorRepository: Repository<Navigator>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions','navigators'],
    });
  }

  async findById(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions','navigators','navigators.navigatorType'],
    });
  }

   async findByCode(code: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { code },
      relations: ['permissions','navigators'],
    });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      code: createRoleDto.code,
      description: createRoleDto.description,
    });

    if (createRoleDto.permissionIds) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
      role.permissions = permissions;
    }
    if (createRoleDto.navigatorIds) {
      const lstNavigatorDecodes = createRoleDto.navigatorIds.map((nav)=>Base64EncryptionUtil.decrypt(nav)) ;
      const navigators = await this.navigatorRepository.find({
        where: { id: In(lstNavigatorDecodes) },
      });
      role.navigators = navigators;
    }

    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.permissionIds) {
      const permissions = await this.permissionRepository.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
      role.permissions = permissions;
    }

    if (updateRoleDto.navigatorIds) {
      const navigatorDecodes = updateRoleDto.navigatorIds.map((item)=> Base64EncryptionUtil.decrypt(item));
      const navigators = await this.navigatorRepository.find({
        where: { id: In(navigatorDecodes) },
      });
      role.navigators = navigators;
    }
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async getNavigatorsByRole(roleId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['navigators','navigators.navigatorType'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.navigators;
  }

  async assignNavigators(roleId: number, assignNavigatorDto: AssignNavigatorDto): Promise<Role> {
    const role = await this.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const navigators = await this.navigatorRepository.find({
      where: { id: In(assignNavigatorDto.navigatorIds) },
    });

    role.navigators = navigators;
    return this.roleRepository.save(role);
  }
} 