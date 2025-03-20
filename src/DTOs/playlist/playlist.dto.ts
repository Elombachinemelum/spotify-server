import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatPlayListDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  description?: string;

  //   @IsArray({ message: 'Songs must be an array of song Ids' })
  //   @IsString({ each: true })
  //   songs: string[];

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  userId: string;
}
