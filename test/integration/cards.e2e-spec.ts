import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { CardsFactory } from '../factories/card.factory';
import { clearDatabase } from '../utils/database';
import { CardType } from '@prisma/client';

describe('CardsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let token: string;
  let cardsFactory: CardsFactory;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prisma = app.get(PrismaService);
    await clearDatabase(prisma);
    await app.init();
    
    const hashedPassword = await bcrypt.hash('StrongPass!123', 10);
    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: hashedPassword,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'testuser@example.com',
        password: 'StrongPass!123',
      });

    token = response.body.token;
    cardsFactory = new CardsFactory(app, token);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new card', async () => {
    const response = await cardsFactory.create(
      'Test Card',
      '1234567890123456',
      'Test User',
      '123',
      '12/26',
      'TestPassword123',
      true,
      CardType.CREDIT
    );

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should fetch all cards', async () => {
    return request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

  it('should fetch a specific card', async () => {
    const createResponse = await cardsFactory.create(
      'Another Test Card',
      '2345678901234567',
      'Another User',
      '456',
      '12/26',
      'AnotherTestPassword123',
      false,
      CardType.DEBIT
    );
    const cardId = createResponse.body.id;
    
    return request(app.getHttpServer())
      .get(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

  it('should delete a card', async () => {
    const createResponse = await cardsFactory.create(
      'Final Test Card',
      '3456789012345678',
      'Final User',
      '789',
      '12/26',
      'FinalTestPassword123',
      true,
      CardType.BOTH
    );
    const cardId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should return 404 when fetching a non-existent card', async () => {
    const nonExistentCardId = 9999;
    return request(app.getHttpServer())
      .get(`/cards/${nonExistentCardId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
