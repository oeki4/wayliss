import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class DeletePhotoDto {
  @IsNotEmpty()
  @Type(() => Number)
  photoId: number;

  @IsNotEmpty()
  @Type(() => Number)
  announcementId: number;
}
