import { Injectable, NotFoundException, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Game from 'src/entities/game.enity';
import User from 'src/entities/user.entity';
import { GameInfo } from 'src/models/interfaces';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(User) private userRepository: Repository<User>, // private usersService: UsersService,
  ) {}

  //   select * from game where "game"."player1Id" = 1 or "game"."player2Id" = 1
  async getHistory(id: number): Promise<GameInfo[]> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const games = await this.gameRepository.find({
      where: [
        {
          player1: user,
        },
        {
          player2: user,
        },
      ],
      relations: ['player1', 'player2'],
    });
    const info = games.map((game) => {
      return {
        score1: game.score1,
        username1: game.player1.username,
        image1: game.player1.avatar,
        score2: game.score2,
        username2: game.player2.username,
        image2: game.player2.avatar,
        type: game.type,
        winnerId: game.winnerId,
      };
    });
    return info;
  }
}
