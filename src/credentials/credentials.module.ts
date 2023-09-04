import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { UsersModule } from 'src/users/users.module';
import { CredentialsRepository } from './credentials.repository';

@Module({
  imports: [UsersModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  exports: [CredentialsService]
})
export class CredentialsModule {}
