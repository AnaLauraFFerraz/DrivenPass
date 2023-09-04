import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const { email } = userDto;
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) throw new ConflictException("Email alredy in use.");

    return this.usersRepository.createUser(userDto);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
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
