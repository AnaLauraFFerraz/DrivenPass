import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export function authenticatedRequest(app: INestApplication, method: string, url: string) {
  return (token: string) => {
    return request(app.getHttpServer())[method](url)
      .set('Authorization', `Bearer ${token}`);
  };
}
