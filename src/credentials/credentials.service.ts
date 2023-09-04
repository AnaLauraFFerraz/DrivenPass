import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import Cryptr = require('cryptr');
import { User } from '@prisma/client';

const cryptr = new Cryptr('YOUR_SECRET_KEY');

@Injectable()
export class CredentialsService {

  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(createCredentialDto: CreateCredentialDto, user: User) {
    const encryptedPassword = cryptr.encrypt(createCredentialDto.password);
    createCredentialDto.password = encryptedPassword;

    const existingCredential = await this.credentialsRepository.findByTitleForUser(createCredentialDto.title, user.id);
    if (existingCredential) {
      throw new ConflictException('Credential with this title already exists.');
    }

    return await this.credentialsRepository.create(createCredentialDto, user.id);
  }

  async findAll(user: User) {
    return await this.credentialsRepository.findAllByUser(user.id);
  }

  async findOne(id: number, user: User) {
    const credential = await this.credentialsRepository.findById(id, user.id);
    if (!credential) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }
    credential.password = cryptr.decrypt(credential.password);
    return credential;
  }

  async update(id: number, updateCredentialDto: CreateCredentialDto, user: User) {
    const existingCredential = await this.credentialsRepository.findById(id, user.id);
    if (!existingCredential) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    if (updateCredentialDto.password) {
      updateCredentialDto.password = cryptr.encrypt(updateCredentialDto.password);
    }

    return await this.credentialsRepository.update(id, updateCredentialDto);
  }

  async remove(id: number, user: User) {
    const existingCredential = await this.credentialsRepository.findById(id, user.id);
    if (!existingCredential) {
      throw new NotFoundException(`Credential with ID ${id} not found.`);
    }

    return await this.credentialsRepository.remove(id);
  }
}
