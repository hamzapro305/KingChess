import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { hashPassword } from '../../common/helpers/password.helper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email.toLowerCase());
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findByEmailWithPassword(email.toLowerCase());
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async createUser(email: string, password: string): Promise<User> {
    return this.userRepository.create({
      email: email.toLowerCase(),
      password: await hashPassword(password),
    });
  }
}
