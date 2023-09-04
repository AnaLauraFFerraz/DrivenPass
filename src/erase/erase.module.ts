import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { EraseRepository } from './erase.repository';
import { UsersModule } from 'src/users/users.module';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { NotesModule } from 'src/notes/notes.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  imports: [UsersModule, CredentialsModule, NotesModule, CardsModule],
  controllers: [EraseController],
  providers: [EraseService, EraseRepository],
  exports: [EraseService]
})
export class EraseModule {}
