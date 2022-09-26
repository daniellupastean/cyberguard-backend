import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
}
