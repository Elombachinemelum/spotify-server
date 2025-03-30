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
  ): Promise<Prisma.ArtistCreateInput> {
    let artist: Prisma.ArtistCreateInput;
    try {
      artist = await this.artistService.createArtist(newArtist);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return artist;
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
  async updateArtist(@Body() artist: UpdateArtistDto, @Param('id') id: string) {
    return await this.artistService.updateArtist(id, artist);
  }
}
