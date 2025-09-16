import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { errorMessages } from 'src/utils/constants';
import { constructNotFoundMessage } from 'src/utils/functions';
import {
  ArtistDto,
  SerializedArtist,
  UpdateArtistDto,
} from 'src/DTOs/artist/artist.dto';
import { PartialArtist } from 'src/types';

@Controller('artist')
@UseInterceptors(ClassSerializerInterceptor)
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  async createArtist(
    @Body() newArtist: ArtistDto,
  ): Promise<{ artist: PartialArtist; message: string[] }> {
    let artist: PartialArtist;
    let existingArtist: PartialArtist | null;
    let message: string[] = [];
    try {
      existingArtist = await this.artistService.getArtistByEmail(
        newArtist.email,
      );
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (existingArtist)
      throw new ConflictException(
        `Artist with the email ${existingArtist.email} already exists`,
      );

    try {
      const artistData = await this.artistService.createArtist(newArtist);
      artist = new SerializedArtist(artistData.newArtist);
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
  async getArtists(
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<{
    data: PartialArtist[];
    count: number;
    total: number;
  }> {
    let artist: {
      data: PartialArtist[];
      count: number;
      total: number;
    };
    try {
      artist = await this.artistService.getArtists(pageNumber, pageSize);
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
  async getArtist(@Param('id') id: string): Promise<PartialArtist> {
    let artist: PartialArtist | null;
    try {
      artist = await this.artistService.getArtistById(id);
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
    artist: PartialArtist;
    message: string[];
  }> {
    let updatedArtist: PartialArtist;
    let existingArtist: PartialArtist | null;
    let message: string[] = [];

    try {
      existingArtist = await this.artistService.getArtistById(id);
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
      updatedArtist = new SerializedArtist(artistData.artist);
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
