import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  // get all games of a user
  @Get('/history/:userId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.gameService.getHistory(userId);
  }
}
