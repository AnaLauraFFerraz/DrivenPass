import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../utils/database';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { CredentialFactory } from '../factories/credential.factory';

describe('CredentialsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let token: string;
  let credentialFactory: CredentialFactory;

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

      credentialFactory = new CredentialFactory(app, token);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new credential', async () => {
    return request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Credential',
        url: 'https://google.com.br',
        username: 'testuser@example.com',
        password: 'StrongPass!123',
      })
      .expect(HttpStatus.CREATED);
  });
  

  it('should not create a credential with an existing title', async () => {
    await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Credential',
        url: 'https://google.com.br',
        username: 'testuser@example.com',
        password: 'StrongPass!123',
      });

    return request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Credential',
        url: 'https://google.com.br',
        username: 'testuser@example.com',
        password: 'StrongPass!123',
      })
      .expect(HttpStatus.CONFLICT);
  });

  it('should fetch all credentials for a user', async () => {
    return request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

  // it('should fetch a specific credential', async () => {
  //   const createResponse = await credentialFactory.create(
  //     'Test Credential',
  //     'https://google.com.br',
  //     'testuser@example.com',
  //     'StrongPass!123'
  //   );
  //   const credentialId = createResponse.body.id;
    
  //   return request(app.getHttpServer())
  //     .get(`/credentials/${credentialId}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(HttpStatus.OK);
  // });

  // it('should delete a credential', async () => {
  //   const createResponse = await credentialFactory.create(
  //     'Test Credential',
  //     'https://google.com.br',
  //     'testuser@example.com',
  //     'StrongPass!123'
  //   );
  //   const credentialId = createResponse.body.id;

  //   return request(app.getHttpServer())
  //     .delete(`/credentials/${credentialId}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(HttpStatus.NO_CONTENT);
  // });

  it('should return 404 when fetching a non-existent credential', async () => {
    const nonExistentCredentialId = 9999;
    return request(app.getHttpServer())
      .get(`/credentials/${nonExistentCredentialId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
