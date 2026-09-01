import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ThrowError } from '../../common/helpers/error.helper';
import { verifyPassword } from '../../common/helpers/password.helper';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user || !(await verifyPassword(password, user.password))) {
      ThrowError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { id: user.id, email: user.email };
  }

  login(user: AuthenticatedUser): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
