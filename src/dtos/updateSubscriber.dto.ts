import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  newEmail: string;
}
