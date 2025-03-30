import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [PrismaModule],
})
export class ArtistModule {}
