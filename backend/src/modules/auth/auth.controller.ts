import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ThrowError } from '../../common/helpers/error.helper';
import { JwtAuthGuard } from './auth-guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() dto: LoginDto): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (user) {
      ThrowError('User already exists', HttpStatus.CONFLICT);
    }

    try {
      await this.userService.createUser(dto.email, dto.password);
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        ThrowError('User already exists', HttpStatus.CONFLICT);
      }
      throw error;
    }
    return { message: 'User registered successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/private')
  privateRoute() {
    return {
      message: 'This is a private route',
      success: true,
    };
  }
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}
