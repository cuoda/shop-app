import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}
