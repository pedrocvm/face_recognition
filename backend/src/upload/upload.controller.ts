import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'user/user.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  async findAll() {
    return await this.uploadService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.uploadService.findById(id);
  }

  @Get('author/:id')
  async findByAuthor(@User('id') userId: string) {
    return await this.uploadService.findByAuthor(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId?: string
  ) {
    return await this.uploadService.upload(file, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User('id') userId: string) {
    return await this.uploadService.delete(id, userId);
  }
}
