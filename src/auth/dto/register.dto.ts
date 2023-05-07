import { IsEmail, Length, IsString, IsNotEmpty, IsNumber } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  age:  number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  university: string;
}
