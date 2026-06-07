import { forwardRef, Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [PrismaModule, UserModule, forwardRef(() => SongsModule)],
  exports: [PlaylistService],
})
export class PlaylistModule {}
