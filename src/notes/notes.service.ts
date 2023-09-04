import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {

  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    const existingNote = await this.notesRepository.findByTitleForUser(createNoteDto.title, user.id);
    if (existingNote) {
      throw new ConflictException('Note with this title already exists.');
    }

    return await this.notesRepository.create(createNoteDto, user.id);
  }

  async findAll(user: User) {
    return await this.notesRepository.findAllForUser(user.id);
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepository.findByIdForUser(id, user.id);
    if (!note) {
      throw new NotFoundException(`Note not found.`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: CreateNoteDto, user: User) {
    const existingNote = await this.notesRepository.findByIdForUser(id, user.id);
    if (!existingNote) {
      throw new NotFoundException(`Note not found.`);
    }
    return await this.notesRepository.update(id, updateNoteDto, user.id);
  }

  async remove(id: number, user: User) {
    const existingNote = await this.notesRepository.findByIdForUser(id, user.id);
    if (!existingNote) {
      throw new NotFoundException(`Note not found.`);
    }
    return await this.notesRepository.remove(id, user.id);
  }
}
