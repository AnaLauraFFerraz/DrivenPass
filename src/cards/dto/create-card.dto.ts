import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { CardType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'Title of the card' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Card number' })
  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @ApiProperty({ description: 'Card printed name' })
  @IsNotEmpty()
  @IsString()
  printedName: string;

  @ApiProperty({ description: 'Security code of the card' })
  @IsNotEmpty()
  @IsString()
  securityCode: string;

  @ApiProperty({ description: 'Card expiration date' })
  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;

  @ApiProperty({ description: 'Password of the card' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Is virtual card' })
  @IsNotEmpty()
  @IsBoolean()
  isVirtual: boolean;

  @ApiProperty({ description: 'Card type' })
  @IsNotEmpty()
  @IsEnum(CardType)
  type: CardType;
}
