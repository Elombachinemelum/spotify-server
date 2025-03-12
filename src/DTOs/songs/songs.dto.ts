import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class NewSongDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsArray({ message: 'Artists must be an array' })
  @IsString({ message: 'Each artist must be a string', each: true })
  @IsNotEmpty({ message: 'Artists field is required' })
  readonly artists: string[];

  @IsDateString({}, { message: 'Release date must be a date string' })
  readonly releaseDate: Date;

  @IsMilitaryTime({ message: 'Duration must be a military time. "MM:SS"' })
  readonly duration: Date;
}
