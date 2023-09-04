import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10, { message: 'Password is too short' })
  @Matches(
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/,
    { message: 'Password too weak' },
  )
  password: string;
}
