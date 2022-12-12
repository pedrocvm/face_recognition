import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { UserModel } from 'user/user.model';

@Schema({
  collection: 'uploads',
  versionKey: false,
  toJSON: {
    transform: (doc: DocumentType, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  timestamps: true
})
export class UploadModel extends Document {
  @Prop({
    required: true
  })
  imageUrl: string;

  @Prop()
  name?: string;

  @Prop()
  data?: any[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Types.ObjectId
  })
  author: UserModel;
}

export const UploadSchema = SchemaFactory.createForClass(UploadModel);
