import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NewSongDto } from 'src/DTOs/songs/songs.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSong(song: NewSongDto) {
    let newSong: Prisma.SongCreateInput;
    const getConnectObjects = (ids: string[] = []) => {
      return ids.map((id) => ({ id }));
    };
    if (song.artists && song.artists.length > 0) {
      newSong = await this.prismaService.song.create({
        data: {
          ...song,
          artists: {
            connect: getConnectObjects(song.artists),
          },
          playLists: {
            connect: song.playLists ? getConnectObjects(song.playLists) : [],
          },
        },
      });
    } else {
      newSong = await this.prismaService.song.create({
        data: {
          ...song,
          playLists: { connect: [] },
          artists: { connect: [] },
        },
      });
    }
    return newSong;
  }
}
