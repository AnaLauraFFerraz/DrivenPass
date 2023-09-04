import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { clearDatabase } from './utils/database';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService()

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
  });

  it('GET /health => should return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)
      .expect("I'm okay");
  });

  it('POST /auth/sign-up => should sign-up successfully', async () => {
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        email: "test@test.com",
        password: "Test!@#$12"
      })
      .expect(HttpStatus.CREATED)

    const user = await prisma.user.findFirst({
      where: { email: "test@test.com" }
    })

    expect(user).not.toBe(null);
  })

  // it('POST /notes => should create a credential', async () => {
  //   // setup
  //   const user = await prisma.user.create({
  //     data: {
  //       email: "test@test.com",
  //       password: "Test!@#$12"
  //     }
  //   })

  //   await request(app.getHttpServer())
  //     .post("/notes")
  //     .send({
  //       title: "Test",
  //       note: "Test note"
  //     })
  //     .expect(HttpStatus.CREATED)
    
  //     const note = await prisma.note.findFirst({
  //       where: {userId: user.id}
  //     })
    
  //     expect(note.title).toBe("Test note");
  // })
});
