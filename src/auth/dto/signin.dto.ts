import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MinLength } from 'class-validator';

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
