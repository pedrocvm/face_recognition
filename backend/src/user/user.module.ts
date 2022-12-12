import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'auth/constants';
import { JwtStrategy } from 'auth/jwt.strategy';
import { UploadModule } from 'upload/upload.module';
import { UserModel, UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    UploadModule
  ],
  providers: [UserService, JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
