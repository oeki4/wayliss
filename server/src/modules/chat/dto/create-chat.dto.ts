import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  announcementId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
