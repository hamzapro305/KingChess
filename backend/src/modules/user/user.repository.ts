import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUserRepository } from './intefaces/user-repository.interface';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);

    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel
      .findOne({
        username,
      })
      .exec();
  }
}
