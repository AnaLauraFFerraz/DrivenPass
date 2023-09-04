import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCredentialDto } from "./dto/create-credential.dto";
import { User } from "@prisma/client";

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTitleForUser(title: string, userId: number) {
    return this.prisma.credential.findFirst({
      where: {
        title: title,
        userId: userId,
      },
    });
  }
  
  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const { title, url, username, password } = createCredentialDto;

    return this.prisma.credential.create({
        data: {
            userId,
            title,
            url,
            username,
            password,
        }
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.credential.findMany({
      where: {
        userId: userId
      }
    });
  }

  async findById(id: number, userId: number) {
    const credential = await this.prisma.credential.findUnique({
      where: { id }
    });
    if (!credential || credential.userId !== userId) {
      throw new NotFoundException(`Credential with ID ${id} not found`);
    }
    return credential;
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
