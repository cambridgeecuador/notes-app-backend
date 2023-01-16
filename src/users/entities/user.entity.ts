import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

import { UserStatus } from '../utils/user.interface';
import { UserRoles as Roles } from 'src/auth/models/roles.model';

@Schema()
export class User {
  @Prop({ required: true })
  idNumber: string;

  @ExcludeProperty()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: Roles.STUDENT, enum: Roles })
  role: Roles;

  @Prop({ required: true, default: UserStatus.WAITING, enum: UserStatus })
  status: UserStatus;

  @Prop(
    raw({
      qualification: { type: String },
      result: { type: String },
      overallScore: { type: String },
    }),
  )
  details: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
