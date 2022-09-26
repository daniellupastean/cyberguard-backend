import { IsUrl, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The site should have a URL' })
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The site should have a label' })
  @IsIn(['fake', 'satire'])
  label: string;
}
