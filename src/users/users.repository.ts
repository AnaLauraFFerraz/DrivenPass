import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository {
  private SALT = 10;
  constructor(private readonly prisma: PrismaService) {}
  
  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email }
    })
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ 
      data: {
        ...userDto,
        password: bcrypt.hashSync(userDto.password, this.SALT)
      }
     });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id } 
    });
  }
}
