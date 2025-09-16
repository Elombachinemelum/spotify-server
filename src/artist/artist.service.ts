import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
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
    private authService: AuthService,
  ) {}

  async getArtistById(
    id: string,
  ): Promise<Partial<Prisma.ArtistCreateInput> | null> {
    return await this.prismaService.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        biography: true,
      },
    });
  }

  async getArtistByEmail(
    email: string,
  ): Promise<Partial<Prisma.ArtistCreateInput> | null> {
    return await this.prismaService.artist.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        biography: true,
      },
    });
  }

  async getArtists(
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    data: Partial<Prisma.ArtistCreateInput>[];
    count: number;
    total: number;
  }> {
    const skip: number = (pageNumber - 1) * pageSize;
    const artists = await this.prismaService.artist.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        biography: true,
        // songs: {
        //   select: {
        //     id: true,
        //     title: true,
        //     createdAt: true,
        //     updatedAt: true,
        //     lyrics: true,
        //     releaseDate: true,
        //     duration: true,
        //   },
        // },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: artists,
      count: artists.length,
      total: await this.prismaService.artist.count(),
    };
  }

  async createArtist(
    artist: ArtistDto,
  ): Promise<{ newArtist: Prisma.ArtistCreateInput; message: string[] }> {
    let newArtist: Prisma.ArtistCreateInput;
    artist.password = await this.authService.hashPassword(artist.password);
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
