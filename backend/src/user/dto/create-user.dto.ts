import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from '../user.model';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be void' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be void' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be void' })
  password: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty({ message: 'User Role cannot be void.' })
  role: UserRoleEnum;

  @IsDate({ message: 'Last Login must be a Date.' })
  lastLogin?: string;

  @IsString()
  token?: string;
}
