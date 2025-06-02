import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAnnouncementDto {
  @IsNotEmpty()
  @Type(() => Number)
  announcementId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
