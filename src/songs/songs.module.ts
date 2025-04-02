import { forwardRef, Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistModule } from 'src/artist/artist.module';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  controllers: [SongsController],
  providers: [SongsService],
  imports: [forwardRef(() => ArtistModule), PrismaModule, PlaylistModule],
  exports: [SongsService],
})
export class SongsModule {}
