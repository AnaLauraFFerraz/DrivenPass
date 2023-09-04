import { Controller, Delete, Body, UseGuards, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseDto } from './dto/erase.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  async eraseAccount(@Body() eraseDto: EraseDto, @User() user: UserPrisma) {
    try {
      return await this.eraseService.eraseAccount(eraseDto, user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Incorrect password.');
      }
      throw new NotFoundException();
    }
  }
}
