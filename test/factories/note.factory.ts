import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class NotesFactory {
  constructor(private app: INestApplication, private token: string) {}

  async create(title: string, content: string) {
    return request(this.app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${this.token}`)
      .send({ title, content });
  }
}
