import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadPhotoDto {
  @IsNotEmpty()
  @Type(() => Number)
  announcementId: number;
}
