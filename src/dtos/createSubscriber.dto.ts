import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriberDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The subscriber should have an email address' })
  @IsString()
  @IsEmail()
  email: string;
}
