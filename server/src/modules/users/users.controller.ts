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
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorCodes } from '@/shared/const/errorCodes';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { AuthGuard } from '@/guards/auth.guard';
import { JwtPayload } from '@/modules/auth/types/jwtPayload';
import { UpdateUserDto } from './dto/update-user.dto';

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
          maxSize: 8 * 1024 * 1024,
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

  @Put()
  @UseGuards(AuthGuard)
  updateProfile(
    @Request() request: Request & { user: JwtPayload },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(request.user, updateUserDto);
  }
}
