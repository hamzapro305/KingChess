import { User } from '../schemas/user.schema';

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;

  findById(id: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  findByEmailWithPassword(email: string): Promise<User | null>;

  findAll(): Promise<User[]>;
}
