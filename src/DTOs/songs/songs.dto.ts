import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class NewSongDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsString({ message: 'Artist must be a string' })
  @IsNotEmpty({ message: 'Artist is required' })
  readonly artist: string;

  @IsDateString({}, { message: 'Release date must be a date string' })
  readonly releaseDate: Date;

  @IsMilitaryTime({ message: 'Duration must be a military time. "MM:SS"' })
  readonly duration: Date;
}
