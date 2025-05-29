import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Navigator } from '../entities/navigator.entity';
import { Int32, IsNull, Like, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { AssignRoleDto } from 'src/dtos/assign-role.dto';
import { PaginatedResponse, PaginationParams } from 'src/dtos/filter.dto';
import { EncryptionUtil } from 'src/utils/encryption.util';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';
import { NavigatorDto } from 'src/dtos/navigator.dto';
import { create } from 'domain';

@Injectable()
export class NavigatorService {
    constructor(
        @InjectRepository(Navigator)
        private navigatorRepository: Repository<Navigator>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    async create(createNavigatorDto: NavigatorDto): Promise<Navigator> {
        const decodedId = parseInt(Base64EncryptionUtil.decrypt(createNavigatorDto?.parentId ?? ''));
        const navigator = this.navigatorRepository.create({
            icon: createNavigatorDto.icon ?? '',
            label: createNavigatorDto.label,
            link: createNavigatorDto.link,
            parentId: Number.isNaN(decodedId) ? undefined : decodedId,
            isActive: createNavigatorDto.isActive,
            order: createNavigatorDto.order,
        });
        return await this.navigatorRepository.save(navigator);
    }

    async findAllWithPagination(params: PaginationParams): Promise<PaginatedResponse<Navigator>> {
        const { page = 1, size = 10, search = '' } = params;
        const skip = (page - 1) * size;

        const whereConditions = search ? [
            { label: Like(`%${search}%`) },
            { link: Like(`%${search}%`) },
        ] : {};

        const [data, total] = await this.navigatorRepository.findAndCount({
            where: whereConditions,
            skip,
            take: size,
            order: { id: 'DESC' },
        });

        return {
            data,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }

    async findAll(): Promise<Navigator[]> {
        return await this.navigatorRepository.find({
            relations: ['children'],
            order: { label: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Navigator> {
        const navigator = await this.navigatorRepository.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });

        if (!navigator) {
            throw new NotFoundException(`Navigator with ID ${id} not found`);
        }

        return navigator;
    }

    async update(id: number, updateNavigatorDto: NavigatorDto): Promise<Navigator> {
        const navigator = await this.findOne(id);
        Object.assign(navigator, updateNavigatorDto);
        return await this.navigatorRepository.save(navigator);
    }

    async remove(id: number): Promise<void> {
        const result = await this.navigatorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Navigator with ID ${id} not found`);
        }
    }

    async assignRoles(navigatorId: number, assignRoleDto: AssignRoleDto) {
        const navigator = await this.navigatorRepository.findOne({
            where: { id: navigatorId },
            relations: ['roles'],
        });

        if (!navigator) {
            throw new Error('Navigator not found');
        }

        const roles = await this.roleRepository.findByIds(assignRoleDto.roleIds);
        navigator.roles = roles;

        return this.navigatorRepository.save(navigator);
    }

    async removeRoles(navigatorId: number, roleIds: number[]) {
        const navigator = await this.navigatorRepository.findOne({
            where: { id: navigatorId },
            relations: ['roles'],
        });

        if (!navigator) {
            throw new Error('Navigator not found');
        }
        navigator.roles = navigator.roles.filter(
            role => !roleIds.includes(role.id)
        );

        return this.navigatorRepository.save(navigator);
    }

    async getNavigatorRoles(navigatorId: number) {
        const navigator = await this.navigatorRepository.findOne({
            where: { id: navigatorId },
            relations: ['roles'],
        });

        if (!navigator) {
            throw new Error('Navigator not found');
        }

        return navigator.roles;
    }
}