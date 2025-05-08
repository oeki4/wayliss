import { IsEmail, IsNotEmpty, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Type(() => Number)
  @Min(18)
  @Max(100)
  age: number;

  @IsNotEmpty()
  description: string;
}
