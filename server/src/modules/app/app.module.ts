import { Module } from '@nestjs/common';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/modules/auth/auth.module';
import { AnnouncementModule } from '@/modules/announcement/announcement.module';
import * as path from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatModule } from '@/modules/chat/chat.module';
import { MessageModule } from '@/modules/message/message.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AnnouncementModule,
    ChatModule,
    MessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('uploads'),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '2 days',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
