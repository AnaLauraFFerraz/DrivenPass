import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }
    return this.usersRepository.createUser(userDto);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }
  
  async findById(id: number): Promise<User> {
    const user = this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException("User not found!");
    
    return user;
  }
}
