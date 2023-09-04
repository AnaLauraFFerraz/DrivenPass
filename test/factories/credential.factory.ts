import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export class CredentialFactory {
  constructor(private app: INestApplication, private token: string) {}

  async create(title: string, url: string, username: string, password: string) {
    const response = await request(this.app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${this.token}`)
      .send({ title, url, username, password });

    return response;
  }
}
