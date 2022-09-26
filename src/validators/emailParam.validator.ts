import { IsEmail } from 'class-validator';

export class EmailParam {
  @IsEmail()
  email: string;
}
