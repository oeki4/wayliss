import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  // @Min(18)
  // @IsInt()
  age: number;

  @IsNotEmpty()
  description: string;
}
