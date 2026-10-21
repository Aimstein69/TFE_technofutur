import { IsEmail, IsString, Length, } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(12, 128)
  password: string;

  @IsString()
  @Length(2, 10)
  language: string = 'fr';
}