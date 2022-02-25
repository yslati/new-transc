import { Socket } from 'socket.io';
import { GameStateEnum } from '../static/enums';
import Constants from '../static/constants';
import Ball from './ball';
import Player from './player';
import Paddle from './paddle';
import User from 'src/entities/user.entity';
import { BroadcastObject, GameInfo } from './interfaces';
import generateId from './helpers';

class Game {
  private _id: string;
  private _player1: Player;
  private _player2: Player;
  private _message: string;
  private _middlePaddle?: Paddle;
  private _hasMiddlePaddle: boolean;
  private _isPaused: boolean;
  private _winnerId?: number;
  private _startingSecond = 3;
  private _watchers: Socket[] = [];
  private _ball: Ball;
  private _interval: NodeJS.Timer;
  private _endCallback: Function;
  private _isStarting = false;

  constructor(
    player1: Player,
    player2: Player,
    endCallback: Function,
    hasMiddlePaddle = false,
  ) {
    this._id = generateId();
    this._player1 = player1;
    this._player2 = player2;
    this._ball = new Ball();
    this._endCallback = endCallback;
    this._hasMiddlePaddle = hasMiddlePaddle;
    if (hasMiddlePaddle) {
      this._middlePaddle = new Paddle(
        Constants.MIDDLE_PADDLE_X,
        Constants.MIDDLE_PADDLE_INIT_Y,
        Constants.MIDDLE_PADDLE_MV_AMOUNT,
      );
    }
    this._interval = setInterval(() => this.play(), Constants.FPS);
    this.pause();
    this._isPaused = false;
  }

  public restart(): void {
    if (this.isOver()) {
      this._id = generateId();
      this._ball.reset();
      this._player1.reset();
      this._player2.reset();
      this._interval = setInterval(() => this.play(), Constants.FPS);
    }
  }

  public getGameType(): string {
    return this._hasMiddlePaddle ? 'Triple' : 'Dual';
  }

  public getGameInfo(): GameInfo {
    return {
      score1: this._player1.getScore(),
      username1: this._player1.getUser().displayName,
      image1: this._player1.getUser().avatar,
      image2: this._player2.getUser().avatar,
      score2: this._player2.getScore(),
      username2: this._player2.getUser().displayName,
      userId: this._player1.getUser().id,
      type: this._hasMiddlePaddle ? 'Triple' : 'Dual',
    };
  }

  hasUserId(userId: number): boolean {
    return (
      this._player1.getUser().id === userId ||
      this._player2.getUser().id === userId
    );
  }

  public getId(): string {
    return this._id;
  }

  public getGameState(): GameStateEnum {
    if (this._winnerId){
      return GameStateEnum.OVER;
    }
    if (this._startingSecond > 0) {
      return GameStateEnum.STARTING;
    }
    if (this._isPaused) {
      return GameStateEnum.PAUSED;
    }
    if (
      this._player1.getScore() === Constants.MAX_SCORE ||
      this._player2.getScore() === Constants.MAX_SCORE
    ) {
      return GameStateEnum.OVER;
    } else if (this._ball.isPaused()) {
      return GameStateEnum.PAUSED;
    }
    return GameStateEnum.PLAYING;
  }

  public setGameMessage(state: GameStateEnum): void {
    if (this._message === 'Pause') {
      this._message = undefined;
    }
    if (state === GameStateEnum.PAUSED && this._isPaused) {
      this._message = 'Pause';
    }
  }

  public buildGameStateObject(): BroadcastObject {
    const state = this.getGameState();
    this.setGameMessage(state);
    return {
      ball: {
        x: this._ball.getX(),
        y: this._ball.getY(),
      },
      paddles: {
        ly: this._player1.getPaddle().getY(),
        ry: this._player2.getPaddle().getY(),
        my: this._middlePaddle?.getY(),
      },
      score: {
        p1: this._player1.getScore(),
        username1: this._player1.getUser().displayName,
        image1: this._player1.getUser().avatar,
        p2: this._player2.getScore(),
        username2: this._player2.getUser().displayName,
        image2: this._player2.getUser().avatar,
      },
      state: state,
      startingSecond: this._startingSecond,
      hasMiddlePaddle: this._hasMiddlePaddle,
      message: this._message,
    };
  }

  public getUserById(userId: number): User {
    if (this._player1.getUser().id === userId) {
      return this._player1.getUser();
    } else if (this._player2.getUser().id === userId) {
      return this._player2.getUser();
    }
    return null;
  }

  public addWatcher(socket: Socket): boolean {
    if (this._watchers.length < Constants.MAX_WATCHERS) {
      const watcher = this._watchers.find(
        (watcher) => watcher.id === socket.id,
      );
      if (!watcher) {
        this._watchers.push(socket);
      }
      return true;
    }
    return false;
  }

  public hasWatcher(socket: Socket): boolean {
    return this._watchers.find((watcher) => watcher.id === socket.id) !== undefined;
  }

  public removeWatcher(socket: Socket): boolean {
    const watcher = this._watchers.find((watcher) => watcher.id === socket.id);
    if (watcher) {
      this._watchers.splice(this._watchers.indexOf(watcher), 1);
      return true;
    }
    return false;
  }

  public updatePlayerSocket(userId: number, newSocket: Socket): void {
    if (this._player1.getUser().id === userId) {
      this._player1.setSocket(newSocket);
    } else if (this._player2.getUser().id === userId) {
      this._player2.setSocket(newSocket);
    }
  }

  private broadcastState(): void {
    const currentState = this.buildGameStateObject();
      this._player1
        .getSocket()
        .emit('state', { ...currentState, hasWon: this.getWinner().id === this._player1.getUser().id });
      this._player2
        .getSocket()
        .emit('state', { ...currentState, hasWon: this.getWinner().id === this._player2.getUser().id });
    // broadcast to watchers
    this._watchers.forEach((watcher) => watcher.emit('state', currentState));
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async handleInterrupt(client: Socket): Promise<void> {
    await this.delay(Constants.INTERRUPT_DELAY);
    if (this.hasSocket(client)) {
      this.handlePlayerDisconnect(client);
      this.stop();
    }
  }

  public hasSockets(socket1: Socket, socket2: Socket): boolean {
    return (
      this._player1.getSocket() === socket1 &&
      this._player2.getSocket() === socket2
    );
  }

  private async awardAndPause(player: Player): Promise<void> {
    player.award();
    this._ball.reset();
    this.broadcastState();
    this.pause();
    this._isPaused = false;
    await this.delay(1500);
    this.resume();
  }

  private async handleStarting(): Promise<void> {
    this._isStarting = true;
    await this.delay(Constants.STARTING_DELAY);
    if (--this._startingSecond === 0) {
      this.broadcastState();
      await this.delay(Constants.STARTING_DELAY);
      this.resume();
    }
    this._isStarting = false;
  }


  public async play(): Promise<void> {
    if (this._isStarting) {
      this.broadcastState();
      return;
    } if (this._startingSecond > 0) {
      return await this.handleStarting();
    }
    if (this._ball.handleHCollision(this._player1.getPaddle())) {
      this._middlePaddle?.reset();
      await this.awardAndPause(this._player2);
    }
    if (this._ball.handleHCollision(this._player2.getPaddle())) {
      this._middlePaddle?.reset();
      await this.awardAndPause(this._player1);
    }
    if (this._hasMiddlePaddle && !this.isPaused()) {
      this._middlePaddle.autoMove();
      this._ball.handleMiddlePaddleCollision(this._middlePaddle);
    }
    this._ball.handleVCollision(0, Constants.MAP_HEIGHT);
    this._ball.move();
    this.broadcastState();
    if (this.getGameState() === GameStateEnum.OVER) {
      this.stop();
    }
  }

  public hasSocket(socket: Socket): boolean {
    return (
      this._player1.getSocket() === socket ||
      this._player2.getSocket() === socket
      // this._watchers.includes(socket)
    );
  }

  public getPlayerBySocket(socket: Socket): Player {
    if (this._player1.getSocket() === socket) {
      return this._player1;
    } else if (this._player2.getSocket() === socket) {
      return this._player2;
    }
    return null;
  }

  public getSockets(): Socket[] {
    return [this._player1.getSocket(), this._player2.getSocket()];
  }

  public handlePlayerDisconnect(socket: Socket): void {
    this._ball.reset();
    if (socket.id === this._player1.getSocket().id) {
      this._player1.penalize();
      this._player2.award();
      this._winnerId = this._player2.getUser().id;
      this._message = `${this._player1.getUser().displayName} left`;
    } else if (socket.id === this._player2.getSocket().id) {
      this._player2.penalize();
      this._player1.award();
      this._winnerId = this._player1.getUser().id;
      this._message = `${this._player2.getUser().displayName} left`;
    }
    this.broadcastState();
  }

  public async stop(): Promise<void> {
    clearInterval(this._interval);
    this._player1.disconnect();
    this._player2.disconnect();
    this._endCallback(this);
  }

  public isOver(): boolean {
    return this.getGameState() === GameStateEnum.OVER;
  }

  public limitedPause(): void {
    this.pause();
    this.delay(Constants.GAME_PAUSE).then(() => this.resume());
  }

  public isPaused(): boolean {
    return this._isPaused;
  }

  public async pause(): Promise<void> {
    this._isPaused = true;
    this._ball.pause();
    this._player1.pausePaddle();
    this._player2.pausePaddle();
    this._middlePaddle?.pause();
  }

  public resume(): void {
    this._isPaused = false;
    this._ball.resume();
    this._player1.resumePaddle();
    this._player2.resumePaddle();
    this._middlePaddle?.resume();
  }

  getPlayer1(): Player {
    return this._player1;
  }

  getPlayer2(): Player {
    return this._player2;
  }

  getWinner(): User {
    if (this._winnerId) {
      return this._player1.getUser().id === this._winnerId ? this._player1.getUser() : this._player2.getUser();
    }
    return this._player1.hasWon() ? this._player1.getUser() : this._player2.getUser();
  }

  getLoser(): User {
    if (this._winnerId) {
      return this._player1.getUser().id === this._winnerId ? this._player2.getUser() : this._player1.getUser();
    }
    return this._player1.hasWon() ? this._player2.getUser() : this._player1.getUser();
  }
}

export default Game;
