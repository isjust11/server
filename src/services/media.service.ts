import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { UploadMediaDto, UpdateMediaDto } from '../dtos/media.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async findAll(userId: number): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { isDeleted: false, userId },
    });
  }

  async findById(id: number, userId: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id, isDeleted: false, userId },
    });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async create(createMediaDto: UploadMediaDto): Promise<Media> {
    const media = this.mediaRepository.create(createMediaDto);
    return this.mediaRepository.save(media);
  }

  async update(id: number, updateMediaDto: UpdateMediaDto, userId: number): Promise<Media> {
    const media = await this.findById(id, userId);
    Object.assign(media, updateMediaDto);
    return this.mediaRepository.save(media);
  }

  async remove(id: number, userId: number): Promise<void> {
    const media = await this.findById(id, userId);
    media.isDeleted = true;
    await this.mediaRepository.save(media);
  }

  async deleteFile(id: number, userId: number): Promise<void> {
    const media = await this.findById(id, userId);
    const filePath = path.join(process.cwd(), media.path);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await this.remove(id, userId);
    } catch (_error) {
      throw new Error(`Failed to delete file: ${_error.message}`);
    }
  }

  async uploadFile(file: Express.Multer.File, userId: number): Promise<Media> {
    const userUploadDir = path.join(process.cwd(), 'uploads', userId.toString());
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join('uploads', userId.toString(), filename);
    const fullPath = path.join(process.cwd(), filePath);

    fs.writeFileSync(fullPath, file.buffer);

    const mediaDto: UploadMediaDto = {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      url: `/uploads/${userId}/${filename}`,
      userId,
    };

    return this.create(mediaDto);
  }
} 