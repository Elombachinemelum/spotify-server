import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoginDTO } from 'src/DTOs/auth/auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SerializedUser } from 'src/DTOs/user/user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  async login(@Body() loginData: LoginDTO): Promise<SerializedUser> {
    let user: Prisma.UserCreateInput | null;
    let isValidCredential: boolean = false;
    try {
      user = await this.userService.getUserByEmail(loginData.email);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong, please try again.',
      );
    }
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    try {
      isValidCredential = await this.authService.comparePasswords(
        loginData.password,
        user.password,
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong, please try again.',
      );
    }

    if (!isValidCredential)
      throw new UnauthorizedException('Invalid Credentials');
    return new SerializedUser(user);
  }
}
