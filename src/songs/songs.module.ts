import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistModule } from 'src/artist/artist.module';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  controllers: [SongsController],
  providers: [SongsService],
  imports: [PrismaModule, ArtistModule, PlaylistModule],
})
export class SongsModule {}
