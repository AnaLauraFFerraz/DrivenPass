import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Put } from '@nestjs/common';
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
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: UserPrisma) {
    return await this.credentialsService.findOne(+id, user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCredentialDto: CreateCredentialDto, @User() user: UserPrisma) {
    return await this.credentialsService.update(+id, updateCredentialDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @User() user: UserPrisma) {
    await this.credentialsService.remove(+id, user);
  }
}
