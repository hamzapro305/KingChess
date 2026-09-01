import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  id: true,
  timestamps: true,
  versionKey: false,

  toJSON: {
    transform: (_document: unknown, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  id!: string;

  @Prop({
    // required: true,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 2,
    maxlength: 15,
  })
  username?: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email!: string;

  @Prop({
    required: true,
    select: false,
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
