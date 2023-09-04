import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EraseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async eraseUserData(userId: number) {
    await this.prisma.credential.deleteMany({ where: { userId: userId } });
    await this.prisma.note.deleteMany({ where: { userId: userId } });
    await this.prisma.card.deleteMany({ where: { userId: userId } });

    return this.prisma.user.delete({ where: { id: userId } });
  }
}
