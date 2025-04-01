import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewSongDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsArray({ message: 'Artists must be an array' })
  @IsString({ message: 'Each artist id must be a string', each: true })
  @IsOptional()
  // @IsNotEmpty({ message: 'Artists field is required' })
  readonly artists: string[];

  @IsDateString({}, { message: 'Release date must be a date ISO string' })
  @IsOptional()
  readonly releaseDate: Date;

  @IsMilitaryTime({ message: 'Duration must be a military time. "MM:SS"' })
  readonly duration: string;

  @IsOptional()
  @IsString()
  readonly lyrics?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly playLists: string[];
}
