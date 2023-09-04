import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '@prisma/client';

@Injectable()
export class CardsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCardDto: CreateCardDto, user: User) {
        return this.prisma.card.create({
            data: {
                ...createCardDto,
                userId: user.id,
            },
        });
    }

    async findByTitleForUser(title: string, user: User) {
        return this.prisma.card.findFirst({
            where: {
                title: title,
                userId: user.id,
            },
        });
    }

    async findAllForUser(userId: number) {
        return this.prisma.card.findMany({
            where: {
                userId: userId,
            },
        });
    }

    async findByIdForUser(id: number, userId: number) {
        return this.prisma.card.findFirst({
            where: {
                id: id,
                userId: userId,
            },
        });
    }

    async update(id: number, updateCardDto: CreateCardDto, userId: number) {
        return this.prisma.card.update({
            where: { id },
            data: {
                ...updateCardDto,
                userId,
            },
        });
    }

    async remove(id: number, userId: number) {
        return this.prisma.card.delete({
            where: {
                id: id,
            },
        });
    }
}
