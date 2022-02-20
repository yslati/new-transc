import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import Channel from 'src/entities/channel.entity';
import UserChannel from 'src/entities/user-channel.entity';
import User from 'src/entities/user.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([User, Channel, UserChannel])
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
