import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Prisma } from '@prisma/client';
import { errorMessages } from 'src/utils/constants';
import { constructNotFoundMessage } from 'src/utils/functions';
import { ArtistDto, UpdateArtistDto } from 'src/DTOs/artist/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  async createArtist(
    @Body() newArtist: ArtistDto,
  ): Promise<{ artist: Prisma.ArtistCreateInput; message: string[] }> {
    let artist: Prisma.ArtistCreateInput;
    let message: string[] = [];
    try {
      const artistData = await this.artistService.createArtist(newArtist);
      artist = artistData.newArtist;
      message = artistData.message;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { artist, message };
  }

  @Get()
  async getArtists() {
    let artist: Prisma.ArtistCreateInput | Prisma.ArtistCreateInput[] | null;
    try {
      artist = await this.artistService.getArtists();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!artist)
      throw new HttpException(
        constructNotFoundMessage('Artist'),
        HttpStatus.NOT_FOUND,
      );

    return artist;
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    let artist: Prisma.ArtistCreateInput | Prisma.ArtistCreateInput[] | null;
    try {
      artist = await this.artistService.getArtists(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!artist)
      throw new HttpException(
        constructNotFoundMessage('Artist'),
        HttpStatus.NOT_FOUND,
      );

    return artist;
  }

  @Patch(':id')
  async updateArtist(
    @Body() artist: UpdateArtistDto,
    @Param('id') id: string,
  ): Promise<{
    artist: Prisma.ArtistCreateInput;
    message: string[];
  }> {
    let updatedArtist: Prisma.ArtistCreateInput;
    let existingArtist: Prisma.ArtistCreateInput | null;
    let message: string[] = [];

    try {
      existingArtist = (await this.artistService.getArtists(
        id,
      )) as Prisma.ArtistCreateInput | null;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!existingArtist)
      throw new HttpException(
        constructNotFoundMessage(`Artist with id ${id}`),
        HttpStatus.NOT_FOUND,
      );

    try {
      const artistData = await this.artistService.updateArtist(id, artist);
      updatedArtist = artistData.artist;
      message = artistData.message;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { artist: updatedArtist, message };
  }
}
