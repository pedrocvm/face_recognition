import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './upload.service';
import { UploadModel, UploadSchema } from './upload.model';
import { UserModel, UserSchema } from 'user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UploadModel.name, schema: UploadSchema },
      { name: UserModel.name, schema: UserSchema }
    ]),
    HttpModule
  ],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}
