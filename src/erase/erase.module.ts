import { Module } from '@nestjs/common';
import { EraseController } from './erase.controller';
import { EraseService } from './erase.service';
import { EraseRepository } from './erase.repository';
import { UsersModule } from 'src/users/users.module';
import { CredentialsService } from 'src/credentials/credentials.service';
import { NotesService } from 'src/notes/notes.service';
import { CardsService } from 'src/cards/cards.service';

@Module({
  imports: [UsersModule, CredentialsService, NotesService, CardsService],
  controllers: [EraseController],
  providers: [EraseService, EraseRepository],
  exports: [EraseService]
})
export class EraseModule {}
