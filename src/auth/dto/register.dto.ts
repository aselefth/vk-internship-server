import { IsEmail, Length, IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @Length(3, 20)
  firstName: string;

  @Length(3, 20)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  password: string;
}
