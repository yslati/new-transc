import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Channel from 'src/entities/channel.entity';
import Message from 'src/entities/message.entity';
import User from 'src/entities/user.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forFeature([Channel, User, Message]),
  ],
  exports: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
