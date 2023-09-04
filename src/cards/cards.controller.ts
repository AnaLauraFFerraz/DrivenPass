import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, ConflictException, BadRequestException, NotFoundException, ForbiddenException, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @User() user: UserPrisma) {
    try {
      return await this.cardsService.create(createCardDto, user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Card with this title already exists.');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@User() user: UserPrisma) {
    return await this.cardsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.cardsService.findOne(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardDto: CreateCardDto, @User() user: UserPrisma) {
    try {
      return this.cardsService.update(+id, updateCardDto, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.cardsService.remove(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Card not found.`);
      }
      throw new ForbiddenException();
    }
  }
}
