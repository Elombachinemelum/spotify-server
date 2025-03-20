import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail(undefined, { message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class SerializedUser {
  @Exclude()
  id: string;

  @Exclude()
  password: string;

  @Exclude()
  updatedAt: string | Date | null;

  constructor(partialUser: Partial<SerializedUser>) {
    Object.assign(this, partialUser);
  }
}
