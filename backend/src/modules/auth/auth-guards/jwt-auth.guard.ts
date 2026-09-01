import { HttpStatus, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ThrowError } from '../../../common/helpers/error.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      ThrowError('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
