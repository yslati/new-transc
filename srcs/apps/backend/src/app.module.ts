import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import Channel from './entities/channel.entity';
import UserChannel from './entities/user-channel.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserChannelsModule } from './user-channels/user-channels.module';
import User from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from './messages/messages.module';
import Message from './entities/message.entity';
import { UserFriend } from './entities/user-friend.entity';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './utils/all-http.exception.filter';
import { Conversation } from './entities/conversation.enitity';
import { GameModule } from './game/game.module';
import Game from './entities/game.enity';
import { AdminModule } from './admin/admin.module';
import { ConversationModule } from './conversation/conversation.module';
import { MailModule } from './mail/mail.module';
import { ConversationService } from './conversation/conversation.service';
import { ChannelsGateway } from './channels.gateway';
import { ChatService } from './chat/chat.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

dotenv.config();


@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.IP,
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User, Channel, UserChannel, Message, UserFriend, Conversation, Game],
      synchronize: true,
      autoLoadEntities: true
    }),
    TypeOrmModule.forFeature([Channel, User, UserChannel, Message, UserFriend, Conversation, Game]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: 'process.env.JWT_SECRET_KEY',
      signOptions: { expiresIn: 60*60*25 }
    }),
    UsersModule,
    ChannelsModule,
    UserChannelsModule,
    MessagesModule,
    GameModule,
    AdminModule,
    ConversationModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChatGateway,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    ChannelsGateway,
    ChatService,
    UsersService,
  ]
})
export class AppModule {}
