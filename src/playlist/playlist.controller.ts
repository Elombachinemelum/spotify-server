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
import { PlaylistService } from './playlist.service';
import { errorMessages } from 'src/utils/constants';
import { constructNotFoundMessage } from 'src/utils/functions';
import { Playlist } from 'src/types';
import {
  CreatPlayListDto,
  UpdatePlaylistDto,
} from 'src/DTOs/playlist/playlist.dto';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playListService: PlaylistService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createPlaylist(@Body() playList: CreatPlayListDto) {
    let newPlayList: {
      playlist: CreatPlayListDto;
      message: string[];
    };
    let playlistOwner: Prisma.UserCreateInput | null;

    try {
      playlistOwner = await this.userService.getUserById(playList.userId);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!playlistOwner) {
      throw new HttpException(
        constructNotFoundMessage('User with the provided ID'),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      newPlayList = await this.playListService.createPlaylist(playList);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newPlayList;
  }

  @Get()
  async getPlaylists(): Promise<Playlist[]> {
    let playLists: Playlist[];
    try {
      playLists = await this.playListService.getPlaylists();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return playLists;
  }

  @Get(':id')
  async getPlaylist(@Param('id') id: string): Promise<Playlist | null> {
    let playList: Playlist | null;
    try {
      playList = await this.playListService.getPlaylistById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (playList) return playList;
    throw new HttpException(
      constructNotFoundMessage('Playlist'),
      HttpStatus.NOT_FOUND,
    );
  }

  @Patch(':id')
  async updatePlaylist(
    @Body() playlist: UpdatePlaylistDto,
    @Param('id') id: string,
  ): Promise<{
    playlist: Playlist;
    message: string[];
  }> {
    let exsitingPlaylist: Playlist | null;
    let updatedPlaylistData: { playlist: Playlist; message: string[] };
    try {
      exsitingPlaylist = await this.playListService.getPlaylistById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!exsitingPlaylist)
      throw new HttpException(
        constructNotFoundMessage('Playlist'),
        HttpStatus.NOT_FOUND,
      );

    try {
      updatedPlaylistData = await this.playListService.updatePlaylist(
        id,
        playlist,
      );
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedPlaylistData;
  }
}
