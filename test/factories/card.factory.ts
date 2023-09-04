import * as request from 'supertest';

export class CardsFactory {
  constructor(private readonly app: any, private readonly token: string) {}

  async create(title: string, password: string, securityCode: string) {
    return request(this.app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${this.token}`)
      .send({
        title,
        password,
        securityCode
      });
  }

  async delete(id: number) {
    return request(this.app.getHttpServer())
      .delete(`/cards/${id}`)
      .set('Authorization', `Bearer ${this.token}`);
  }
}
