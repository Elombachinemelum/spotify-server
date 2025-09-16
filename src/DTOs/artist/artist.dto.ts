import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  songs?: string[];

  @IsOptional()
  @IsString()
  biography?: string;

  @IsEmail(undefined, { message: 'Email must be valid' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateArtistDto extends PartialType(ArtistDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeSongs?: string[];
}

export class SerializedArtist {
  @Exclude()
  password: string;

  constructor(partialArtist: Partial<SerializedArtist>) {
    Object.assign(this, partialArtist);
  }
}
