import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Title should not be empty' })
  @MaxLength(100, { message: 'Title is too long' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Note should not be empty' })
  note: string;
}
