import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 10,
  }, {
    message: 'Password too weak',
  })
  password: string;
}
