import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { CardType } from '@prisma/client';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  printedName: string;

  @IsNotEmpty()
  @IsString()
  securityCode: string;

  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  isVirtual: boolean;

  @IsNotEmpty()
  @IsEnum(CardType)
  type: CardType;
}
