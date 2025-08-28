import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  userId: number;
}
