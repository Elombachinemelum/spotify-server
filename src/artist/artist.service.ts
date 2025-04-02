import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ArtistDto, UpdateArtistDto } from 'src/DTOs/artist/artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongsService } from 'src/songs/songs.service';
import { errorMessages } from 'src/utils/constants';
import { getConnectObjects } from 'src/utils/functions';

@Injectable()
export class ArtistService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => SongsService)) private songsService: SongsService,
  ) {}

  async getArtists(
    id?: string,
  ): Promise<Prisma.ArtistCreateInput | Prisma.ArtistCreateInput[] | null> {
    if (id)
      return await this.prismaService.artist.findUnique({
        where: { id },
      });
    return await this.prismaService.artist.findMany();
  }

  async createArtist(
    artist: ArtistDto,
  ): Promise<{ newArtist: Prisma.ArtistCreateInput; message: string[] }> {
    let newArtist: Prisma.ArtistCreateInput;
    const message: string[] = [];
    if (artist.songs && artist.songs?.length) {
      const verificationData = await this.verifyExistingSongs(artist.songs);
      newArtist = await this.prismaService.artist.create({
        data: {
          ...artist,
          songs: { connect: getConnectObjects(verificationData.valid) },
        },
      });
      if (verificationData.invalid.length)
        message.push(
          `The following songs were not linked to this artist. ensure they are valid: ${verificationData.invalid.join(', ')}`,
        );
    } else {
      newArtist = await this.prismaService.artist.create({
        data: {
          ...artist,
          songs: { connect: [] },
        },
      });
    }

    return { newArtist, message };
  }

  async verifyExistingSongs(songs: string[] = []) {
    const data: { valid: string[]; invalid: string[] } = {
      valid: [],
      invalid: [],
    };

    await Promise.all(
      songs.map(async (songId) => {
        let song: Prisma.SongCreateInput | null = null;
        try {
          song = await this.songsService.getSongById(songId);
        } catch (err) {
          console.log(err);
        } finally {
          if (song) data.valid.push(songId);
          else data.invalid.push(songId);
        }
      }),
    );

    return data;
  }

  async updateArtist(
    id: string,
    data: UpdateArtistDto,
  ): Promise<{ artist: Prisma.ArtistCreateInput; message: string[] }> {
    let updatedArtist: Prisma.ArtistCreateInput;
    const message: string[] = [];
    if (
      (data.songs || data.removeSongs) &&
      (data.songs?.length || data.removeSongs?.length)
    ) {
      const [connectSongsData, removeSongsData] = await Promise.all([
        await this.verifyExistingSongs(data.songs),
        await this.verifyExistingSongs(data.removeSongs),
      ]);
      delete data.removeSongs; // we dont want to have this key in the update data
      updatedArtist = await this.prismaService.artist.update({
        where: { id },
        data: {
          ...data,
          songs: {
            connect: getConnectObjects(connectSongsData.valid),
            disconnect: getConnectObjects(removeSongsData.valid),
          },
        },
      });
      if (connectSongsData.invalid.length)
        message.push(
          `${errorMessages.SONGS_NOT_ADDED_TO_ARTIST} ${connectSongsData.invalid.join(', ')}`,
        );
      if (removeSongsData.invalid.length)
        message.push(
          `${errorMessages.SONGS_NOT_REMOVED_FROM_ARTIST} ${removeSongsData.invalid.join(', ')}`,
        );
    } else {
      updatedArtist = await this.prismaService.artist.update({
        where: { id },
        data: {
          ...data,
          songs: { connect: [] },
        },
      });
    }

    return { artist: updatedArtist, message };
  }
}
