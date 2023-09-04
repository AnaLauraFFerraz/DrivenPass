import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode,
   HttpStatus, Put, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    try {
      return this.credentialsService.create(createCredentialDto, user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Credential with this title already exists.');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return await this.credentialsService.findOne(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Credential not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    try {
      return this.credentialsService.update(+id, updateCredentialDto, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Credential with ID ${id} not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.credentialsService.remove(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Credential not found.`);
      }
      throw new ForbiddenException();
    }
  }
}
