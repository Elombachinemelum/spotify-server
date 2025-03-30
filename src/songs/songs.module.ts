import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SongsController],
  providers: [SongsService],
  imports: [PrismaModule],
})
export class SongsModule {}
