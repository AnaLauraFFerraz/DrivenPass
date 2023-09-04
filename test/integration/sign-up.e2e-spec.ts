import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../utils/database';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('AuthController (e2e) - Sign Up', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService()

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await clearDatabase(prisma);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a new user successfully', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'testuser@example.com',
        password: 'StrongPass!123',
      })
      .expect(HttpStatus.CREATED);
  });

  it('should not allow registration with an existing email', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'testuser@example.com',
        password: 'StrongPass!123',
      });

    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'testuser@example.com',
        password: 'AnotherStrongPass!456',
      })
      .expect(HttpStatus.CONFLICT);
  });

  it('should not allow registration with a weak password', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'anotheruser@example.com',
        password: 'weakpass',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
