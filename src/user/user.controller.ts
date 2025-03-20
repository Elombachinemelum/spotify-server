import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, SerializedUser } from 'src/DTOs/user/user.dto';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { FullUser } from 'src/types';
import { errorMessages } from 'src/utils/constants';
import { constructNotFoundMessage } from 'src/utils/functions';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() newUser: CreateUserDto): Promise<SerializedUser> {
    console.log(newUser);
    let existingUSer: Prisma.UserCreateInput | null;
    let createdUSer: Prisma.UserCreateInput;
    try {
      existingUSer = await this.userService.getUserByEmail(newUser.email);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (existingUSer)
      throw new HttpException(
        `User with the email ${existingUSer.email} already exists`,
        HttpStatus.CONFLICT,
      );

    try {
      createdUSer = await this.userService.createUser(newUser);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.CONFLICT,
      );
    }

    return new SerializedUser(createdUSer);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<SerializedUser> {
    let user: Prisma.UserCreateInput | null;
    try {
      user = await this.userService.getUserById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user) return new SerializedUser(user);
    throw new HttpException(
      constructNotFoundMessage('User'),
      HttpStatus.NOT_FOUND,
    );
  }

  @Get('fullUser/:id')
  async getFullUser(@Param('id') id: string): Promise<FullUser | null> {
    let user: FullUser | null;
    try {
      user = await this.userService.getFullUserById(id);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        errorMessages.SOMETHING_WENT_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user) return user;
    throw new HttpException(
      constructNotFoundMessage('User'),
      HttpStatus.NOT_FOUND,
    );
  }
}
