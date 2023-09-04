import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../utils/database';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('AuthController (e2e) - Sign In', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

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

    const saltRounds = 10;
    const plainPassword = 'StrongPass!123';
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign in an existing user successfully', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'testuser@example.com',
        password: 'StrongPass!123',
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

it('should not sign in with an incorrect password', async () => {
    return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
        email: 'testuser@example.com',
        password: 'WrongPass!456',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not sign in a non-existent user', async () => {
    return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
        email: 'nonexistentuser@example.com',
        password: 'SomePass!123',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not sign in without a password', async () => {
    return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
        email: 'testuser@example.com',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not sign in without an email', async () => {
    return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
        password: 'StrongPass!123',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not sign in with an invalid email format', async () => {
    return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
        email: 'invalidemailformat',
        password: 'StrongPass!123',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
});

