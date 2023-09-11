import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export class NotesFactory {
  constructor(private app: INestApplication, private token: string) {}

  async create(title: string, note: string) {
    const response = await request(this.app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${this.token}`)
      .send({ title, note });
      
    return response;
  }
}