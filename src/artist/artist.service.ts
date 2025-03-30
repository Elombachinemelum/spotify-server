import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateArtistDto } from 'src/DTOs/artist/artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prismaService: PrismaService) {}

  async getArtists(
    id?: string,
  ): Promise<Prisma.ArtistCreateInput | Prisma.ArtistCreateInput[] | null> {
    if (id)
      return await this.prismaService.artist.findUnique({ where: { id } });
    return await this.prismaService.artist.findMany();
  }

  async createArtist(
    artist: Prisma.ArtistCreateInput,
  ): Promise<Prisma.ArtistCreateInput> {
    return await this.prismaService.artist.create({ data: artist });
  }

  async updateArtist(
    id: string,
    data: UpdateArtistDto,
  ): Promise<Prisma.ArtistCreateInput> {
    let updatedArtist: Prisma.ArtistCreateInput;
    if (data.songs && data.songs.length > 0) {
      const listOfSongs = data.songs.map((songId) => {
        return { id: songId };
      });
      updatedArtist = await this.prismaService.artist.update({
        where: { id },
        data: {
          ...data,
          Songs: {
            connect: listOfSongs,
          },
        },
      });
    } else {
      updatedArtist = await this.prismaService.artist.update({
        where: { id },
        data,
      });
    }

    return updatedArtist;
  }
}
