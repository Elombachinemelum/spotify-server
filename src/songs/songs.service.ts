import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NewSongDto } from 'src/DTOs/songs/songs.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getConnectObjects } from 'src/utils/functions';
import { ArtistService } from 'src/artist/artist.service';
import { PlaylistService } from 'src/playlist/playlist.service';

@Injectable()
export class SongsService {
  constructor(
    private readonly prismaService: PrismaService,
    private artistService: ArtistService,
    private playlistService: PlaylistService,
  ) {}

  async createSong(song: NewSongDto) {
    let newSong: Prisma.SongCreateInput;
    const message: string[] = [];

    if (
      (song.artists || song.playLists) &&
      (song?.artists?.length > 0 || song?.playLists?.length > 0)
    ) {
      const [artisitVerData, plalistVerData] = await Promise.all([
        await this.verifyExistingArtist(song.artists),
        await this.verifyExistingPlaylist(song.playLists),
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
          playLists: {
            connect: song.playLists
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
          playLists: { connect: [] },
        },
      });
    }
    return { newSong, message };
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
        let artist: Prisma.ArtistCreateInput | null = null;
        try {
          const result = await this.artistService.getArtists(artistId);
          artist = result as Prisma.ArtistCreateInput | null;
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
}
