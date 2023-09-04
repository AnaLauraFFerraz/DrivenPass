import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import { User } from "@prisma/client";

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    return this.prisma.credential.create({
      data: {
        ...createCredentialDto,
        userId,
      }
    });
  }

  async findByTitleForUser(title: string, userId: number) {
    return this.prisma.credential.findFirst({
      where: {
        title,
        userId,
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.credential.findMany({
      where: {
        userId
      }
    });
  }

  async findByIdForUser(id: number, userId: number) {
    return this.prisma.credential.findUnique({
      where: { id, userId }
    });
  }

  async update(id: number, updateCredentialDto: CreateCredentialDto) {
    return this.prisma.credential.update({
      where: { id },
      data: updateCredentialDto
    });
  }

  async remove(id: number) {
    return this.prisma.credential.delete({
      where: { id }
    });
  }
}
