import { PrismaService } from '../../src/prisma/prisma.service';

export async function clearDatabase(prisma: PrismaService) {
  await prisma.card.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
}

export async function createUser(prisma: PrismaService, email: string, password: string) {
  return await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });
}
