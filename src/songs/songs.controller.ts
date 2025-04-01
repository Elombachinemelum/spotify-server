import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { NewSongDto } from 'src/DTOs/songs/songs.dto';
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
  async getSongs(): Promise<Prisma.SongCreateInput[]> {
    let songs: Prisma.SongCreateInput[];
    try {
      songs = await this.songsService.getSongs();
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

  @Put(':id')
  updateSong(@Param('id') id: string) {
    return { id };
  }

  @Delete(':id')
  deleteSong(@Param('id') id: string) {
    return { id };
  }
}
