import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from '@prisma/client';

@Injectable()
export class NotesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createNoteDto: CreateNoteDto, userId: number) {
        return this.prisma.note.create({
            data: {
                ...createNoteDto,
                userId,
            },
        });
    }

    async findByTitleForUser(title: string, userId: number) {
        return this.prisma.note.findFirst({
            where: {
                title,
                userId,
            },
        });
    }

    async findAllForUser(userId: number) {
        return this.prisma.note.findMany({
            where: {
                userId,
            },
        });
    }

    async findByIdForUser(id: number, userId: number) {
        return this.prisma.note.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async update(id: number, updateNoteDto: CreateNoteDto, userId: number) {
        return this.prisma.note.update({
            where: { id },
            data: {
                ...updateNoteDto,
                userId,
            },
        });
    }

    async remove(id: number, userId: number) {
        return this.prisma.note.delete({
            where: {
                id,
                userId,
            },
        });
    }
}
