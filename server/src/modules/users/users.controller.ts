import {
  Controller,
  Post,
  Body,
  HttpException,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  StreamableFile,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorCodes } from '@/shared/const/errorCodes';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          fileIsRequired: false,
          exceptionFactory: () => {
            throw new HttpException(
              'Incorrect avatar',
              ErrorCodes.INCORRECT_AVATAR,
            );
          },
        }),
    )
    avatar?: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, avatar);
  }

  @Get('/:id/avatar')
  async getUserAvatar(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    try {
      const user = await this.usersService.findUserById(+id);
      res.set({ 'Content-Type': 'image/jpeg' });
      if (!user || !user?.avatar) {
        const imageLocation = join(process.cwd(), 'assets', 'none.webp');
        const file = createReadStream(imageLocation);
        return new StreamableFile(file);
      }

      const imageLocation = join(process.cwd(), 'avatars', user.avatar);
      const file = createReadStream(imageLocation);
      return new StreamableFile(file);
    } catch (err) {
      console.log(err);
      const imageLocation = join(process.cwd(), 'assets', 'none.webp');
      const file = createReadStream(imageLocation);
      return new StreamableFile(file);
    }
  }
}
