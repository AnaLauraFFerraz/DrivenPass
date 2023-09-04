import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import Cryptr from 'cryptr';
import { User } from '@prisma/client';

const cryptr = new Cryptr('YOUR_SECRET_KEY');

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto, user: User) {
    const encryptedSecurityCode = cryptr.encrypt(createCardDto.securityCode);
    const encryptedPassword = cryptr.encrypt(createCardDto.password);
    createCardDto.securityCode = encryptedSecurityCode;
    createCardDto.password = encryptedPassword;

    const existingCard = await this.cardsRepository.findByTitleForUser(createCardDto.title, user);
    if (existingCard) {
      throw new ConflictException('Card with this title already exists.');
    }

    return await this.cardsRepository.create(createCardDto, user);
  }

  async findAll(user: User) {
    return await this.cardsRepository.findAllForUser(user.id);
  }

  async findOne(id: number, user: User) {
    const card = await this.cardsRepository.findByIdForUser(id, user.id);
    if (!card) {
      throw new NotFoundException(`Card with not found.`);
    }
    card.securityCode = cryptr.decrypt(card.securityCode);
    card.password = cryptr.decrypt(card.password);
    return card;
  }

  async update(id: number, updateCardDto: CreateCardDto, user: User) {
    const existingCard = await this.cardsRepository.findByIdForUser(id, user.id);
    if (!existingCard) {
      throw new NotFoundException(`Note not found.`);
    }
    return await this.cardsRepository.update(id, updateCardDto, user.id);
  }

  async remove(id: number, user: User) {
    const existingCard = await this.cardsRepository.findByIdForUser(id, user.id);
    if (!existingCard) {
      throw new NotFoundException(`Card with not found.`);
    }
    return await this.cardsRepository.remove(id, user.id);
  }
}
