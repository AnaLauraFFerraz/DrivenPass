import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { clearDatabase } from '../utils/database';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { NotesFactory } from '../factories/note.factory';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let token: string;
  let notesFactory: NotesFactory;

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
    notesFactory = new NotesFactory(app, token);
  });

  afterAll(async () => {
    await app.close();
  });

//   it('should create a new note', async () => {
//     const response = await notesFactory.create('Test Note', 'This is a test note content.');
//     expect(response.status).toBe(HttpStatus.CREATED);
//   });

  it('should fetch all notes', async () => {
    return request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });

//   it('should fetch a specific note', async () => {
//     const createResponse = await notesFactory.create('Another Test Note', 'This is another test note content.');
//     const noteId = createResponse.body.id;
//     return request(app.getHttpServer())
//       .get(`/notes/${noteId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(HttpStatus.OK);
//   });

//   it('should delete a note', async () => {
//     const createResponse = await notesFactory.create('Final Test Note', 'This is the final test note content.');
//     const noteId = createResponse.body.id;
//     return request(app.getHttpServer())
//       .delete(`/notes/${noteId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(HttpStatus.NO_CONTENT);
//   });

  it('should return 404 when fetching a non-existent note', async () => {
    const nonExistentNoteId = 9999;
    return request(app.getHttpServer())
      .get(`/notes/${nonExistentNoteId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
