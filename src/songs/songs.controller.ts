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

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Get()
  getSongs() {
    return [];
  }

  @Get(':id')
  getSong(
    @Param(
      'id',
      new ParseIntPipe({
        // errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE, //Not needed if we provide an error object via exceptionFactory
        exceptionFactory(error) {
          return new HttpException(error, HttpStatus.NOT_ACCEPTABLE);
        },
      }),
    )
    id: number,
  ) {
    return { id };
  }

  @Post()
  addSong(@Body() newSong: NewSongDto) {
    return { ...newSong };
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
