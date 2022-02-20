import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import Game from 'src/entities/game.enity';
import { UserFriend } from 'src/entities/user-friend.entity';
import User from 'src/entities/user.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([User, UserFriend, Game]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
