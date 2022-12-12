import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UploadModel } from 'upload/upload.model';
import FormatDateNow from 'utils/DateFormat';

export enum UserRoleEnum {
  COMMON = '1',
  ADMIN = '2'
}

@Schema({
  collection: 'users',
  versionKey: false,
  toJSON: {
    transform: (doc: DocumentType, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  timestamps: true
})
export class UserModel extends mongoose.Document {
  @Prop({
    required: true
  })
  name: string;

  @Prop({
    lowercase: true,
    required: true,
    unique: true
  })
  email: string;

  @Prop({
    required: true,
    select: false
  })
  password: string;

  @Prop({
    default: UserRoleEnum.COMMON
  })
  role: UserRoleEnum;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: mongoose.Types.ObjectId
  })
  uploads: UploadModel[];

  @Prop({
    default: FormatDateNow()
  })
  lastLogin: string;

  @Prop({
    unique: true
  })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
