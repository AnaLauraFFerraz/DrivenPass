import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsEnum, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';
import { CardType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: "cardExpiration", async: false })
export class IsCardExpiration implements ValidatorConstraintInterface {
  validate(value: string) {
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return dateRegex.test(value);
  }
  defaultMessage() {
    return 'Expiration date must have in format MM/YY';
  }
}
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

  @ApiProperty({
    example: '12/23',
    description: 'User card expiration date'
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsCardExpiration)
  expiration: string;

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
