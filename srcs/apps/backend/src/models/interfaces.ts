import { Socket } from 'socket.io';
import { GameStateEnum } from 'src/static/enums';

export interface BroadcastObject {
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    ly: number;
    ry: number;
    my?: number;
  };
  score: {
    p1: number;
    username1: string;
    image1: string;
    p2: number;
    username2: string;
    image2: string;
  };
  state: GameStateEnum;
  startingSecond?: number;
  hasMiddlePaddle: boolean;
  message?: string;
}

export interface InviteRoom {
  roomId: string;
  gameType: string;
  socket1: Socket;
  socket2?: Socket;
}

export interface GameInfo {
  score1: number;
  username1: string;
  image1: string;
  score2: number;
  username2: string;
  image2: string;
  type: string;
  userId?: number;
  winnerId?: number;
}
