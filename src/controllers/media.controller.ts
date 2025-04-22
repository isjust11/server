import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../services/media.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Media } from '../entities/media.entity';
import { UpdateMediaDto } from '../dtos/media.dto';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  async findAll(@Request() req): Promise<Media[]> {
    return this.mediaService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Media> {
    return this.mediaService.findById(parseInt(id), req.user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|mp4|mp3|pdf)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<Media> {
    return this.mediaService.uploadFile(file, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @Request() req,
  ): Promise<Media> {
    return this.mediaService.update(parseInt(id), updateMediaDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.mediaService.deleteFile(parseInt(id), req.user.id);
  }
} 