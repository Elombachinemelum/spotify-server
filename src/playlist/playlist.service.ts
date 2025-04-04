import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreatPlayListDto,
  UpdatePlaylistDto,
} from 'src/DTOs/playlist/playlist.dto';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongsService } from 'src/songs/songs.service';
import { Playlist } from 'src/types';
import { errorMessages } from 'src/utils/constants';
import { getConnectObjects } from 'src/utils/functions';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => SongsService))
    private readonly songsService: SongsService,
  ) {}

  async createPlaylist(
    playlist: CreatPlayListDto,
  ): Promise<{ playlist: CreatPlayListDto; message: string[] }> {
    const message: string[] = [];
    let newPlaylist: CreatPlayListDto;
    if (playlist.songs && playlist.songs?.length) {
      const verificationData = await this.verifyExistingSongs(playlist.songs);
      newPlaylist = await this.prismaService.playList.create({
        data: {
          ...playlist,
          songs: { connect: getConnectObjects(verificationData.valid) },
        },
      });
      if (verificationData.invalid.length)
        message.push(
          `${errorMessages.SONG_NOT_ADDED_TO_PLAYLIST} ${verificationData.invalid.join(', ')}`,
        );
    } else {
      newPlaylist = await this.prismaService.playList.create({
        data: {
          ...playlist,
          songs: { connect: [] },
        },
      });
    }
    return { playlist: newPlaylist, message };
  }

  async getPlaylists(): Promise<Playlist[]> {
    return await this.prismaService.playList.findMany();
  }

  async getPlaylistById(id: string): Promise<Playlist | null> {
    return await this.prismaService.playList.findUnique({ where: { id } });
  }

  async verifyExistingSongs(songsList: string[] = []) {
    const data: {
      valid: string[];
      invalid: string[];
    } = {
      valid: [],
      invalid: [],
    };

    await Promise.all(
      songsList.map(async (songId) => {
        let song: Prisma.SongCreateInput | null = null;
        try {
          song = await this.songsService.getSongById(songId);
        } catch (error) {
          console.log(error);
        } finally {
          if (song) data.valid.push(songId);
          else data.invalid.push(songId);
        }
      }),
    );
    return data;
  }

  async updatePlaylist(
    id: string,
    playlist: UpdatePlaylistDto,
  ): Promise<{
    playlist: Playlist;
    message: string[];
  }> {
    let updatedPlaylist: Playlist;
    const message: string[] = [];
    if (playlist.songs && playlist.songs?.length) {
      const [addSongData, removeSongData] = await Promise.all([
        await this.verifyExistingSongs(playlist.songs),
        await this.verifyExistingSongs(playlist.removeSongs),
      ]);
      delete playlist.removeSongs; // we dont want to have this key in the update data
      updatedPlaylist = await this.prismaService.playList.update({
        where: { id },
        data: {
          ...playlist,
          songs: {
            connect: getConnectObjects(addSongData.valid),
            disconnect: getConnectObjects(removeSongData.valid),
          },
        },
      });
      if (addSongData.invalid.length)
        message.push(
          `${errorMessages.SONG_NOT_ADDED_TO_PLAYLIST} ${addSongData.invalid.join(', ')}`,
        );
      if (removeSongData.invalid.length)
        message.push(
          `${errorMessages.SONG_NOT_REMOVED_FROM_PLAYLIST} ${removeSongData.invalid.join(', ')}`,
        );
    } else {
      updatedPlaylist = await this.prismaService.playList.update({
        where: { id },
        data: {
          ...playlist,
          songs: { connect: [] },
        },
      });
    }

    return { playlist: updatedPlaylist, message };
  }
}
