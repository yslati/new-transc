import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import Channel from 'src/entities/channel.entity';
import UserChannel from 'src/entities/user-channel.entity';
import { UserFriend } from 'src/entities/user-friend.entity';
import User from 'src/entities/user.entity';
import { UserChannelsController } from './user-channels.controller';
import { UserChannelsService } from './user-channels.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => TypeOrmModule.forFeature([UserChannel, Channel, User, UserFriend]))
  ],
  controllers: [UserChannelsController],
  providers: [UserChannelsService]
})
export class UserChannelsModule {}
