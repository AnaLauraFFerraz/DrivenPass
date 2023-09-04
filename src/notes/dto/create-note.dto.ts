import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: 'Note title' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Title should not be empty' })
  @MaxLength(100, { message: 'Title is too long' })
  title: string;

  @ApiProperty({ description: 'Note' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Note should not be empty' })
  note: string;
}
