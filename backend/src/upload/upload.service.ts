import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { UserModel } from 'user/user.model';
import { CreateUploadDto } from './dto';
import { UploadModel } from './upload.model';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(UploadModel.name)
    private readonly uploadModel: Model<UploadModel>,
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly httpService: HttpService
  ) {}

  async findAll(): Promise<UploadModel[]> {
    try {
      const allUploads = await this.uploadModel.find();

      return allUploads;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const upload = await this.uploadModel.findById(id);

      if (!upload) {
        throw new HttpException(`Upload not found`, 400);
      }

      return {
        imageUrl: upload.imageUrl,
        data: (await this.imageAnalyzer(upload.imageUrl)).data
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findByAuthor(userId: string): Promise<UploadModel[]> {
    try {
      const author = await this.userModel.findById(userId);

      if (!author) {
        throw new HttpException('User not found', 400);
      }

      const uploadsByAuthor = await this.uploadModel.find({
        author
      });

      if (!uploadsByAuthor) {
        throw new HttpException(`Upload not found`, 400);
      }

      return uploadsByAuthor;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async upload(file: Express.Multer.File, userId: string): Promise<any> {
    try {
      const author = await this.userModel.findById(userId);

      if (!author) {
        throw new HttpException('User not found', 400);
      }

      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new HttpException('File must be an jpg/jpeg/png File', 400);
      }

      const { Location } = await this.uploadFile(
        file.buffer,
        file.originalname
      );

      if (!!Location) {
        await this.create({ imageUrl: Location }, author);
        const newUpload = (await this.findByAuthor(userId)).pop();

        newUpload.data = (await this.imageAnalyzer(Location)).data;
        newUpload.name = file.originalname;

        await this.uploadModel.findByIdAndUpdate(newUpload.id, newUpload);

        return newUpload;
      }
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async create(
    data: CreateUploadDto,
    author: UserModel
  ): Promise<CreateUploadDto> {
    try {
      const record = new this.uploadModel();
      record.imageUrl = data.imageUrl;
      record.author = author;

      const newUpload = await this.uploadModel.create(record);

      await this.userModel.findByIdAndUpdate(
        { _id: author.id },
        { $push: { uploads: newUpload } },
        { new: true, useFindAndModify: false }
      );

      return newUpload.save();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    try {
      const author = await this.userModel.findById(userId);

      if (!author) {
        throw new HttpException('User not found', 400);
      }

      const uploadToDelete = await this.uploadModel.findByIdAndRemove(id);

      await this.userModel
        .findByIdAndUpdate(
          { _id: userId },
          { $pull: { uploads: id } },
          { new: true, useFindAndModify: false }
        )
        .populate('uploads');

      if (!uploadToDelete) {
        throw new HttpException(`Upload not found`, 400);
      }

      return {
        message: `Upload ${id} successfully deleted`
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  private async uploadFile(dataBuffer: Buffer, fileName: string): Promise<any> {
    try {
      const s3 = new S3({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY
        },
        region: process.env.AWS_REGION
      });

      return await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${uuid()}-${fileName}`
        })
        .promise();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  private async imageAnalyzer(imageUrl: string): Promise<any> {
    try {
      return (
        await this.httpService.axiosRef.get(
          `${process.env.AWS_ANALYSE_URL}?imageUrl=${imageUrl}`
        )
      ).data;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async deleteMany(authorId: string): Promise<void> {
    try {
      const author = await this.userModel.findById(authorId);

      if (!author) {
        throw new HttpException('User not found', 400);
      }

      if (!author.uploads.length) return;

      await this.uploadModel.deleteMany({ author });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
