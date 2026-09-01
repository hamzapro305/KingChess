import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../../common/helpers/password.helper';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const usersService = {
    findByEmailWithPassword: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  };
  const service = new AuthService(
    usersService as unknown as UserService,
    jwtService as unknown as JwtService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('returns a safe user when credentials are valid', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      id: 'user-id',
      email: 'person@example.com',
      password: await hashPassword('secure-password'),
    });

    await expect(
      service.validateUser('person@example.com', 'secure-password'),
    ).resolves.toEqual({ id: 'user-id', email: 'person@example.com' });
  });

  it('uses the same unauthorized response for missing users and bad passwords', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      service.validateUser('person@example.com', 'secure-password'),
    ).rejects.toMatchObject<HttpException>({ status: HttpStatus.UNAUTHORIZED });
  });

  it('signs a token with the public user fields', () => {
    expect(
      service.login({ id: 'user-id', email: 'person@example.com' }),
    ).toEqual({ access_token: 'signed-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'person@example.com',
    });
  });
});
