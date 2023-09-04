import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto{}
