import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, HttpStatus, Put, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    try {
      return this.notesService.create(createNoteDto, user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Note with this title already exists.');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.notesService.findOne(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Note not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: CreateNoteDto, @User() user: UserPrisma) {
    try {
      return this.notesService.update(+id, updateNoteDto, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Note not found.`);
      }
      throw new ForbiddenException();
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @User() user: UserPrisma) {
    try {
      return this.notesService.remove(+id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Note not found.`);
      }
      throw new ForbiddenException();
    }
  }
}
