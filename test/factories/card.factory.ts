import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CardType } from '@prisma/client';

export class CardsFactory {
  constructor(private app: INestApplication, private token: string) {}

  async create(
    title: string,
    cardNumber: string,
    printedName: string,
    securityCode: string,
    expiration: string,
    password: string,
    isVirtual: boolean,
    type: CardType
  ) {
    return request(this.app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${this.token}`)
      .send({
        title,
        cardNumber,
        printedName,
        securityCode,
        expiration,
        password,
        isVirtual,
        type
      });
  }
}
