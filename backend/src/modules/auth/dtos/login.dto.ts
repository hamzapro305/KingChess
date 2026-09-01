import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;
}
