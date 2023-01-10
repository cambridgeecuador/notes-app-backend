import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';

@Schema()
export class File {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  idNumber: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true, default: Date.now, type: Date })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
