import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isFake: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(0)
  accuracy: number;
}
