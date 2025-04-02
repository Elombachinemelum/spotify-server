import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [forwardRef(() => SongsModule), PrismaModule],
  exports: [ArtistService],
})
export class ArtistModule {}
