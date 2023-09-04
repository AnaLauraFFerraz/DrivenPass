// create-credential.dto.ts

import { IsString, IsNotEmpty, IsUrl, IsEmail } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
