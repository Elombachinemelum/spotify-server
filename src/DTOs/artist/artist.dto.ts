import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}

export class UpdateArtistDto extends PartialType(ArtistDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeSongs?: string[];
}
