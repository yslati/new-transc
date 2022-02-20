import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { has } from 'lodash';
import { ChatService } from './chat/chat.service';
import { ConversationDto } from './conversation/dto/conversation.dto';
import Game from './models/game';
import Player from './models/player';
import { Logger } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import GameHistory from './entities/game.enity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from './users/users.service';
import { UserStatus } from './entities/user.entity';
import { GameInfo, InviteRoom } from './models/interfaces';
import generateId from './models/helpers';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    @InjectRepository(GameHistory)
    private GameRepository: Repository<GameHistory>,
    private usersService: UsersService,
  ) { }

  async handleConnection(client: Socket) {
    const query = client.handshake.query;
    if (has(query, 'token') && query['token']) {
      await this.chatService.newClient(
        query['token'] as string,
        client,
        this.server,
      );
    }
    // check if the user is already in a game,
    // if so, update their socket so he can resume the game
    const user = this.chatService.getUserBySocket(client);
    if (user) {
      const game = this.games.find((gm) => gm.hasUserId(user.id));
      if (game) {
        game.updatePlayerSocket(user.id, client);
      }
    }
  }

  @SubscribeMessage('channel_created')
  handleNewChannelCreated(client: Socket, channel: any) {
    this.chatService.newChannelCreated(channel);
  }

  @SubscribeMessage('new_message')
  handleNewMessage(socket: Socket, args: ConversationDto) {
    if (args.message && args.message.trim() !== '' && args.from && args.to)
      this.chatService.newMessage(args);
  }

  private logger: Logger = new Logger('MatchGateway');

  private unique: Set<Socket> = new Set();
  private normalGameQueue: Socket[] = [];
  private tripleGameQueue: Socket[] = [];
  private games: Game[] = [];
  private invites: InviteRoom[] = [];

  handleGameInterrupt(client: Socket) {
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      game.handleInterrupt(client);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const invite = this.invites.find((inv) => inv.socket1 === client);
    if (invite) {
      // remove the invite
      this.invites = this.invites.filter((inv) => inv.socket1 !== client);
      this.logger.log(`Invite ${invite.roomId} removed`);
    }
    this.removeFromAllGamesQueues(client);
    this.handleGameInterrupt(client);
    // remove the user if he is watching a game
    this.games.find((gm) => gm.hasWatcher(client))?.removeWatcher(client);
    this.logger.log(`Removed from all queues: ${client.id}`);
    this.chatService.disconnectClient(client);
  }

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  removeFromAllGamesQueues(client: Socket, removeFromMainQueue = true) {
    this.normalGameQueue = this.normalGameQueue.filter(
      (socket) => socket !== client,
    );
    this.tripleGameQueue = this.tripleGameQueue.filter(
      (socket) => socket !== client,
    );
    if (removeFromMainQueue) {
      this.unique.delete(client);
    }
  }

  /*
   * leave a game
   */

  @SubscribeMessage('leave_game')
  async leaveGame(client: Socket) {
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      game.handlePlayerDisconnect(client);
      game.stop();
    }
  }

  /*
   * invitation logic: when a user invites another user to play a game
   */

  // this function is called when a player invites another player to play a game
  @SubscribeMessage('invite_to')
  async inviteToGame(client: Socket, payload: any) {
    // check if the user is already in a game
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      return;
    }
    this.invites.push({
      roomId: generateId(),
      gameType: payload.gameType,
      socket1: client,
      socket2: null,
    });
    const sender = this.chatService.getUserBySocket(client);
    // send the invitation to the user
    const receiver = await this.usersService.findUserById(payload.userId);
    if (receiver) {
      const recvSockets = this.chatService.getSocketsByUserId(receiver.id);
      if (recvSockets.length > 0) {
        recvSockets.forEach((socket) => {
          socket.emit('game_invitation', {
            message: `${sender.displayName} invited you to play a game`,
            roomId: this.invites[this.invites.length - 1].roomId,
          });
        });
      }
    }
  }

  @SubscribeMessage('update_user')
  updateUser(client: Socket, payload: any) {
    this.chatService.updateUser(payload.userId);
  }

  @SubscribeMessage('begin_invitation_game')
  beginInvitationGame(client: Socket, payload: any): void {
    const invite = this.invites.find((inv) => inv.roomId === payload.roomId);
    if (invite) {
      invite.socket2 = client;
      if (invite.socket1 && invite.socket2) {
        this.removeFromAllGamesQueues(invite.socket1, false);
        this.removeFromAllGamesQueues(invite.socket2, false);
        this._startNewGame([invite.socket1, invite.socket2], invite.gameType);
        this.invites = this.invites.filter(
          (inv) => inv.roomId !== invite.roomId,
        );
      }
    }
  }

  @SubscribeMessage('cancel_game_invitation')
  cancelInvitation(client: Socket, payload: any): void {
    const invite = this.invites.find((inv) => inv.roomId === payload.roomId);
    if (invite) {
      invite.socket1.emit('game_invitation_cancelled', payload.userId);
      this.invites = this.invites.filter((inv) => inv.roomId !== invite.roomId);
    }
  }

  /*
   * send live games data
   */
  @SubscribeMessage('live_games')
  getLiveGames(client: Socket): void {
    const user = this.chatService.getUserBySocket(client);
    let liveGames: Game[] = [];
    if (user) {
      liveGames = this.games.filter((game) => !game.hasUserId(user.id));
    }
    const infos: GameInfo[] = liveGames.map((game) => game.getGameInfo());
    client.emit('live_games', infos);
  }

  @SubscribeMessage('force_logout')
  forceLogout(client: Socket, payload: any): void {
    if (!payload){
    const user = this.chatService.getUserBySocket(client);
    if (user) {
      const sockets = this.chatService.getSocketsByUserId(user.id);
      if (sockets.length > 0) {
        sockets.forEach((sock) => {
          sock.emit('force_logout');
        });
      }
    }
    return;
  }
  const sockets = this.chatService.getSocketsByUserId(payload);
      if (sockets.length > 0) {
        sockets.forEach((sock) => {
          sock.emit('force_logout');
        });
      }
  }

  @SubscribeMessage('up_paddle')
  handleUpPaddle(client: Socket, payload: any): void {
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      const player = game.getPlayerBySocket(client);
      if (payload === 'down') {
        player.getPaddle().up(true);
      } else if (payload === 'up') {
        player.getPaddle().up(false);
      }
    }
  }

  @SubscribeMessage('down_paddle')
  handleDownPaddle(client: Socket, payload: any): void {
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      const player = game.getPlayerBySocket(client);
      if (payload === 'down') {
        player.getPaddle().down(true);
      } else if (payload === 'up') {
        player.getPaddle().down(false);
      }
    }
  }

  @SubscribeMessage('pause_game')
  async handlePauseGame(client: Socket): Promise<void> {
    const game = this.games.find((gm) => gm.hasSocket(client));
    if (game) {
      if (!game.isPaused()) {
        game.limitedPause();
      }
    }
  }

  @SubscribeMessage('spectator')
  addWatcherToGame(client: Socket, payload: any): void {
    this.games.find((gm) => gm.hasUserId(payload.userId))?.addWatcher(client);
  }

  private async _removeOverGame(game: Game): Promise<void> {
    try {
      const sockets = game.getSockets();
      this.unique.delete(sockets[0]);
      this.unique.delete(sockets[1]);
      this.games.splice(this.games.indexOf(game), 1);

      const gameHistory = new GameHistory();
      gameHistory.player1 = game.getPlayer1().getUser();
      gameHistory.player2 = game.getPlayer2().getUser();
      gameHistory.score1 = game.getPlayer1().getScore();
      gameHistory.score2 = game.getPlayer2().getScore();
      gameHistory.winnerId = game.getWinner().id;
      gameHistory.type = game.getGameType();

      await this.GameRepository.save({
        ...gameHistory,
      });

      await this.usersService.updateScore(
        gameHistory.player1.id,
        gameHistory.score1,
      );
      await this.usersService.updateScore(
        gameHistory.player2.id,
        gameHistory.score2,
      );
      await this.usersService.updateStatus(
        game.getPlayer1().getUser().id,
        UserStatus.ONLINE,
      );
      await this.usersService.updateStatus(
        game.getPlayer2().getUser().id,
        UserStatus.ONLINE,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async _startNewGame(
    socketsArr: Socket[],
    payload: any,
  ): Promise<void> {
    socketsArr.forEach((socket) => {
      socket?.emit('game_started');
    });
    await this.delay(1200);
    try {
      const p1 = this.chatService.getUserBySocket(socketsArr[0]);
      const p2 = this.chatService.getUserBySocket(socketsArr[1]);
      this.games.push(
        new Game(
          new Player(socketsArr[0], false, p1),
          new Player(socketsArr[1], true, p2),
          this._removeOverGame.bind(this),
          payload === 'triple',
        ),
      );
      await this.usersService.updateStatus(p1.id, UserStatus.INGAME);
      await this.usersService.updateStatus(p2.id, UserStatus.INGAME);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('join_queue_match')
  async joinQueue(client: Socket, payload: any) {
    if (this.unique.has(client)) {
      return;
    }
    const user = this.chatService.getUserBySocket(client);
    if (user && user.sockets.length > 0) {
      for (let i = 0; i < user.sockets.length; i++) {
        if (this.unique.has(user.sockets[i]))
          return;
      }
    }
    this.unique.add(client);
    this.logger.log(`Client ${client.id} joined queue with payload: ${payload}`);
    if (payload === 'dual') {
      if (this.normalGameQueue.push(client) > 1)
        this._startNewGame(
          [this.normalGameQueue.shift(), this.normalGameQueue.shift()],
          'dual',
        );
    } else if (payload === 'triple') {
      if (this.tripleGameQueue.push(client) > 1)
        this._startNewGame(
          [this.tripleGameQueue.shift(), this.tripleGameQueue.shift()],
          'triple',
        );
    }
  }
}
