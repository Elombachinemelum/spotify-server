import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NewSongDto, updateSongDto } from 'src/DTOs/songs/songs.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getConnectObjects } from 'src/utils/functions';
import { ArtistService } from 'src/artist/artist.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { errorMessages } from 'src/utils/constants';

@Injectable()
export class SongsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => PlaylistService))
    private playlistService: PlaylistService,
  ) {}

  async createSong(song: NewSongDto) {
    let newSong: Prisma.SongCreateInput;
    const message: string[] = [];

    if (
      (song.artists || song.playlists) &&
      (song?.artists?.length > 0 || song?.playlists?.length > 0)
    ) {
      const [artisitVerData, plalistVerData] = await Promise.all([
        await this.verifyExistingArtist(song.artists),
        await this.verifyExistingPlaylist(song.playlists),
      ]);

      newSong = await this.prismaService.song.create({
        data: {
          ...song,
          releaseDate: !song.releaseDate
            ? new Date().toISOString()
            : song.releaseDate,
          artists: {
            connect: song.artists
              ? getConnectObjects(artisitVerData.valid)
              : [],
          },
          playlists: {
            connect: song.playlists
              ? getConnectObjects(plalistVerData.valid)
              : [],
          },
        },
      });

      if (artisitVerData.invalid.length) {
        message.push(
          `The following artists were not added to the song, ensure they are valid ${artisitVerData.invalid.join(', ')}`,
        );
      }
      if (plalistVerData.invalid.length) {
        message.push(
          `The following playlists were not added to the song, ensure they are valid ${plalistVerData.invalid.join(', ')}`,
        );
      }
    } else {
      newSong = await this.prismaService.song.create({
        data: {
          ...song,
          releaseDate: !song.releaseDate
            ? new Date().toISOString()
            : song.releaseDate,
          artists: { connect: [] },
          playlists: { connect: [] },
        },
      });
    }
    return { newSong, message };
  }

  async getSongs(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ data: Prisma.SongCreateInput[]; total: number; count: number }> {
    const skip = (pageNumber - 1) * pageSize;
    const songs = await this.prismaService.song.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    return {
      data: songs,
      count: songs.length,
      total: await this.prismaService.song.count(),
    };
  }

  async getSongById(id: string): Promise<Prisma.SongCreateInput | null> {
    return this.prismaService.song.findUnique({ where: { id } });
  }

  async verifyExistingArtist(artistList: string[] = []) {
    const data: {
      valid: string[];
      invalid: string[];
    } = {
      valid: [],
      invalid: [],
    };

    await Promise.all(
      artistList.map(async (artistId) => {
        let artist: Partial<Prisma.ArtistCreateInput> | null = null;
        try {
          artist = await this.artistService.getArtistById(artistId);
        } catch (error) {
          console.log(error);
        } finally {
          if (artist) data.valid.push(artistId);
          else data.invalid.push(artistId);
        }
      }),
    );
    return data;
  }

  async verifyExistingPlaylist(playlistList: string[] = []) {
    const data: {
      valid: string[];
      invalid: string[];
    } = {
      valid: [],
      invalid: [],
    };

    await Promise.all(
      playlistList.map(async (artistId) => {
        let playList: Prisma.PlayListCreateInput | null = null;
        try {
          const result = await this.playlistService.getPlaylistById(artistId);
          playList = result as Prisma.PlayListCreateInput | null;
        } catch (error) {
          console.log(error);
        } finally {
          if (playList) data.valid.push(artistId);
          else data.invalid.push(artistId);
        }
      }),
    );
    return data;
  }

  async updateSong(
    id: string,
    data: updateSongDto,
  ): Promise<{ song: Prisma.SongCreateInput; message: string[] }> {
    let updatedSong: Prisma.SongCreateInput;
    const message: string[] = [];
    if (
      (data.artists ||
        data.playlists ||
        data.removeArtists ||
        data.removePlaylists) &&
      (data.artists?.length ||
        data.playlists?.length ||
        data.removeArtists?.length ||
        data.removePlaylists?.length)
    ) {
      const [
        artisitVerData,
        plalistVerData,
        artistRemoveData,
        playlistRemoveData,
      ] = await Promise.all([
        await this.verifyExistingArtist(data.artists),
        await this.verifyExistingPlaylist(data.playlists),
        await this.verifyExistingArtist(data.removeArtists),
        await this.verifyExistingPlaylist(data.removePlaylists),
      ]);
      delete data.removeArtists; // we dont want to have this key in the update data
      delete data.removePlaylists;
      updatedSong = await this.prismaService.song.update({
        where: { id },
        data: {
          ...data,
          artists: {
            connect: getConnectObjects(artisitVerData.valid),
            disconnect: getConnectObjects(artistRemoveData.valid),
          },
          playlists: {
            connect: getConnectObjects(plalistVerData.valid),
            disconnect: getConnectObjects(playlistRemoveData.valid),
          },
        },
      });
      if (artisitVerData.invalid.length)
        message.push(
          `${errorMessages.ARTIST_NOT_ADDED_TO_SONG} ${artisitVerData.invalid.join(', ')}`,
        );
      if (plalistVerData.invalid.length)
        message.push(
          `${errorMessages.PLAYLIST_NOT_ADDED_TO_SONG} ${plalistVerData.invalid.join(', ')}`,
        );
      if (artistRemoveData.invalid.length)
        message.push(
          `${errorMessages.ARTIST_NOT_REMOVED_FROM_SONG} ${artistRemoveData.invalid.join(', ')}`,
        );
      if (playlistRemoveData.invalid.length)
        message.push(
          `${errorMessages.PLAYLIST_NOT_REMOVED_FROM_SONG} ${playlistRemoveData.invalid.join(', ')}`,
        );
    } else {
      updatedSong = await this.prismaService.song.update({
        where: { id },
        data: {
          ...data,
          artists: { connect: [] },
          playlists: { connect: [] },
        },
      });
    }

    return { song: updatedSong, message };
  }
}
