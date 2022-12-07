import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10)
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  language: string;
}
