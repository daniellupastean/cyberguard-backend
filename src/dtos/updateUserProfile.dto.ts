import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsBoolean()
  jade: boolean;

  @ApiProperty()
  @IsString()
  @IsIn(['ru', 'ro', 'en'])
  language: string;

  @ApiProperty()
  @IsBoolean()
  newsletter: boolean;

  @ApiProperty()
  @IsBoolean()
  emailNotifications: boolean;

  @ApiProperty()
  @IsString()
  @IsIn(['default', 'dark'])
  theme: string;
}
