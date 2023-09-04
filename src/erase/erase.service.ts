import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EraseDto } from './dto/erase.dto';
import { EraseRepository } from './erase.repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EraseService {
  constructor(private readonly eraseRepository: EraseRepository) {}

  async eraseAccount(eraseDto: EraseDto, user: User) {
    const isPasswordValid = await bcrypt.compare(eraseDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password.');
    }
    return await this.eraseRepository.eraseUserData(user.id);
  }
}
