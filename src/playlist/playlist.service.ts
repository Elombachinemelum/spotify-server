import { Injectable } from '@nestjs/common';
import { CreatPlayListDto } from 'src/DTOs/playlist/playlist.dto';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Playlist } from 'src/types';

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPlaylist(playList: CreatPlayListDto): Promise<Playlist> {
    return await this.prismaService.playList.create({ data: playList });
  }

  async getPlaylists(): Promise<Playlist[]> {
    return await this.prismaService.playList.findMany();
  }

  async getPlaylistById(id: string): Promise<Playlist | null> {
    return await this.prismaService.playList.findUnique({ where: { id } });
  }
}
