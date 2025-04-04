import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatPlayListDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray({ message: 'Songs must be an array of song Ids' })
  @IsString({ each: true })
  @IsOptional()
  songs?: string[];

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdatePlaylistDto extends PartialType(CreatPlayListDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeSongs?: string[];
}
