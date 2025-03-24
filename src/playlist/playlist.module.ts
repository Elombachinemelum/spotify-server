import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [PrismaModule, UserModule],
})
export class PlaylistModule {}
