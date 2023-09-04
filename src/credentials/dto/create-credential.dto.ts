// create-credential.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsEmail } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty({ description: 'Credential title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Credential url' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Credential username' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'Credential password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
