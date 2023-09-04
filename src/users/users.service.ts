import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findUserById(id);
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  async remove(id: number): Promise<User> {
    return this.usersRepository.deleteUser(id);
  }
}
