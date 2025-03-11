import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('songs')
export class SongsController {
  @Get()
  getSongs() {
    return [];
  }

  @Get(':id')
  getSong() {
    return {};
  }

  @Post()
  addSong() {
    return {};
  }

  @Post('all')
  addSongs() {
    return [];
  }

  @Put(':id')
  updateSong() {
    return {};
  }

  @Delete(':id')
  deleteSong() {
    return {};
  }
}
