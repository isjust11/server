import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { AssignRoleDto } from 'src/dtos/assign-role.dto';
import { PaginatedResponse, PaginationParams } from 'src/dtos/filter.dto';
import { Base64EncryptionUtil } from 'src/utils/base64Encryption.util';
import { Feature } from 'src/entities/feature.entity';
import { FeatureDto } from 'src/dtos/feature.dto';

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(Feature)
        private featureRepository: Repository<Feature>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    async create(createFeatureDto: FeatureDto): Promise<Feature> {
        const decodedId = parseInt(Base64EncryptionUtil.decrypt(createFeatureDto?.parentId ?? ''));
        const navigator = this.featureRepository.create({
            icon: createFeatureDto.icon ?? '',
            label: createFeatureDto.label,
            link: createFeatureDto.link,
            parentId: Number.isNaN(decodedId) ? undefined : decodedId,
            isActive: createFeatureDto.isActive,
            sortOrder: createFeatureDto.sortOrder,
        });
        return await this.featureRepository.save(navigator);
    }

    async findAllWithPagination(params: PaginationParams): Promise<PaginatedResponse<Feature>> {
        const { page = 1, size = 10, search = '' } = params;
        const skip = (page - 1) * size;

        const whereConditions = search ? [
            { label: Like(`%${search}%`) },
            { link: Like(`%${search}%`) },
        ] : {};

        const [data, total] = await this.featureRepository.findAndCount({
            where: whereConditions,
            skip,
            take: size,
            relations: ['featureType',],
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

    async findAll(): Promise<Feature[]> {
        return await this.featureRepository.find({
            relations: ['children'],
            order: { label: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Feature> {
        const navigator = await this.featureRepository.findOne({
            where: { id },
            relations: ['children', 'parent'],
        });

        if (!navigator) {
            throw new NotFoundException(`Feature with ID ${id} not found`);
        }

        return navigator;
    }

    async update(id: number, updateFeatureDto: FeatureDto): Promise<Feature> {
        const navigator = await this.findOne(id);
        Object.assign(navigator, updateFeatureDto);
        if (!updateFeatureDto.parentId || updateFeatureDto.parentId === '') {
            navigator.parent = undefined;
            navigator.parentId = undefined;
        } else {
            const parentId = parseInt(Base64EncryptionUtil.decrypt(updateFeatureDto.parentId ?? ''));
            navigator.parent = await this.featureRepository.findOne({ where: { id: parentId } }) ?? undefined;
        }
        return await this.featureRepository.save(navigator);
    }

    async remove(id: number): Promise<void> {
        const result = await this.featureRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Feature with ID ${id} not found`);
        }
    }

    async assignRoles(navigatorId: number, assignRoleDto: AssignRoleDto) {
        const navigator = await this.featureRepository.findOne({
            where: { id: navigatorId },
            relations: ['roles'],
        });

        if (!navigator) {
            throw new Error('Feature not found');
        }

        const roles = await this.roleRepository.findByIds(assignRoleDto.roleIds);
        // navigator.roles = roles;

        return this.featureRepository.save(navigator);
    }

    async removeRoles(navigatorId: number, roleIds: number[]) {
        const navigator = await this.featureRepository.findOne({
            where: { id: navigatorId },
            relations: ['roles'],
        });

        if (!navigator) {
            throw new Error('Feature not found');
        }
        // navigator.roles = navigator.roles.filter(
        //     role => !roleIds.includes(role.id)
        // );

        return this.featureRepository.save(navigator);
    }

    // async getFeatureRoles(navigatorId: number) {
    //     const navigator = await this.featureRepository.findOne({
    //         where: { id: navigatorId },
    //         relations: ['roles'],
    //     });

    //     if (!navigator) {
    //         throw new Error('Feature not found');
    //     }

    //     return navigator.roles;
    // }
}