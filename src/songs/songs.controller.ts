import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { NewSongDto, updateSongDto } from 'src/DTOs/songs/songs.dto';
import { errorMessages } from 'src/utils/constants';
import { Prisma } from '@prisma/client';
import { constructNotFoundMessage } from 'src/utils/functions';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  // @Get(':id')
  // getSong(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({
  //       // errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE, //Not needed if we provide an error object via exceptionFactory
  //       exceptionFactory(error) {
  //         return new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
  //       },
  //     }),
  //   )
  //   id: number,
  // ) {
  //   return { id };
  // }

  @Post()
  async addSong(@Body() newSong: NewSongDto) {
    let newSongCreated: {
      newSong: Prisma.SongCreateInput;
      message: string[];
    };

    try {
      newSongCreated = await this.songsService.createSong(newSong);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      createdSong: newSongCreated.newSong,
      message: newSongCreated.message.length
        ? newSongCreated.message
        : undefined,
    };
  }

  @Get()
  async getSongs(
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe)
    pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<{ data: Prisma.SongCreateInput[]; total: number; count: number }> {
    let songs: { data: Prisma.SongCreateInput[]; total: number; count: number };
    try {
      songs = await this.songsService.getSongs(pageNumber, pageSize);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return songs;
  }

  @Get(':id')
  async getSong(@Param('id') id: string) {
    let song: Prisma.SongCreateInput | null;
    try {
      song = await this.songsService.getSongById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!song)
      throw new HttpException(
        constructNotFoundMessage(`Song with id ${id}`),
        HttpStatus.NOT_FOUND,
      );

    return song;
  }

  @Post('all')
  addSongs() {
    return [];
  }

  @Patch(':id')
  async updateSong(
    @Body() song: updateSongDto,
    @Param('id') id: string,
  ): Promise<{
    song: Prisma.SongCreateInput;
    message: string[];
  }> {
    let existingSong: Prisma.SongCreateInput | null;
    let updatedSongData: {
      song: Prisma.SongCreateInput;
      message: string[];
    };
    try {
      existingSong = await this.songsService.getSongById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!existingSong)
      throw new HttpException(
        constructNotFoundMessage(`Song with id ${id}`),
        HttpStatus.NOT_FOUND,
      );

    try {
      updatedSongData = await this.songsService.updateSong(id, song);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedSongData;
  }

  @Delete(':id')
  deleteSong(@Param('id') id: string) {
    return { id };
  }
}
