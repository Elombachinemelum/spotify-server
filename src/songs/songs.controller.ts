import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { NewSongDto } from 'src/DTOs/songs/songs.dto';
import { errorMessages } from 'src/utils/constants';
import { Prisma } from '@prisma/client';

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
    let newSongCreated: Prisma.SongCreateInput;
    try {
      newSongCreated = await this.songsService.createSong(newSong);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newSongCreated;
  }

  @Get()
  getSongs() {
    return [];
  }

  @Get(':id')
  getSong(@Param('id') id: string) {
    return [];
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
