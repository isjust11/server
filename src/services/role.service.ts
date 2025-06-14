import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleDto } from '../dtos/role.dto';
import { Permission } from '../entities/permission.entity';
import { Feature } from '../entities/feature.entity';
import { AssignFeatureDto } from '../dtos/assign-navigator.dto';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions','features'],
    });
  }

  async findById(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions','features','features.featureType'],
    });
  }

   async findByCode(code: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { code },
      relations: ['permissions','features'],
    });
  }

  async create(createRoleDto: RoleDto): Promise<Role> {
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
    if (createRoleDto.features) {
      const lstFeatureDecodes = createRoleDto.features.map((nav)=>Base64EncryptionUtil.decrypt(nav)) ;
      const navigators = await this.featureRepository.find({
        where: { id: In(lstFeatureDecodes) },
      });
      role.features = navigators;
    }

    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: RoleDto): Promise<Role> {
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

    if (updateRoleDto.features) {
      const navigatorDecodes = updateRoleDto.features.map((item)=> Base64EncryptionUtil.decrypt(item));
      const navigators = await this.featureRepository.find({
        where: { id: In(navigatorDecodes) },
      });
      role.features = navigators;
    }
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async getFeaturesByRole(roleId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['features','features.featureType'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.features;
  }

  async assignFeatures(roleId: number, assignFeatureDto: AssignFeatureDto): Promise<Role> {
    const role = await this.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const features = await this.featureRepository.find({
      where: { id: In(assignFeatureDto.navigatorIds) },
    });

    role.features = features;
    return this.roleRepository.save(role);
  }
} 