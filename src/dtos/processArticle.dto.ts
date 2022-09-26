import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessArticleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The article should have a URL' })
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The article should have a title' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The article should have content' })
  @Length(10)
  content: string;
}
