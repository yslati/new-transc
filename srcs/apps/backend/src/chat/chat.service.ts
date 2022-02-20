import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationDto } from 'src/conversation/dto/conversation.dto';
import Channel from 'src/entities/channel.entity';
import { Conversation } from 'src/entities/conversation.enitity';
import User, { UserStatus } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { getConnection, getManager, Repository } from 'typeorm';

class UserType extends User {
  sockets: Socket[] = [];
}

@Injectable()
export class ChatService {
  public users: UserType[] = [];

  private server: Server = null;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) { }

  async newClient(token: string, socket: Socket, server: Server) {
    if (!this.server) this.server = server;
    try {
      const { user } = this.jwtService.verify(token);
      let exists = this.users.find((userItem) => userItem.id === user);
      if (exists) {
        exists.sockets.push(socket);
      } else {
        let _new: UserType = await this.usersService.findUserById(user);
        if (!_new) {
          throw new Error('User not found');
        } else {
          await this.usersService.updateStatus(_new.id, UserStatus.ONLINE);

          _new.sockets = [socket];
          this.users.push(_new);
          // emit that a new client connected
          // server.emit('user_connected', exists[0][0].id);
        }
      }
    } catch (error) {
    }
  }

  async disconnectClient(socket: Socket) {
    try {
      let user = this.users.find((user) => {
        if (user.sockets.find((sock) => sock.id === socket.id) !== null) {
          return user;
        }
        return null;
      });

      this.users.forEach((user) => {
        user.sockets.forEach(async (sock) => {
          if (sock.id == socket.id) {
            user.sockets.splice(user.sockets.indexOf(sock), 1);
            if (user.sockets.length === 0) {
              await this.usersService.updateStatus(user.id, UserStatus.OFFLINE);
              this.users.splice(this.users.indexOf(user), 1);
            }
          }
        });
      });
      // if (user) {
      //     user.sockets.splice(user.sockets.indexOf(socket), 1);
      //     if (user.sockets.length === 0) {
      //         // user.status = UserStatus.OFFLINE;

      //         await this.usersService.updateStatus(user.id, UserStatus.OFFLINE);

      //         // await getConnection().manager.query(`
      //         //     update users
      //         //     set "displayName" = $1,
      //         //     "avatar" = $2,
      //         //     "enableTwoFactorAuth" = $3,
      //         //     "status" = $4
      //         //     where "users"."id" = $5
      //         // `, [user.displayName, user.avatar, user.enableTwoFactorAuth, UserStatus.OFFLINE, user.id]);
      //         this.users.splice(this.users.indexOf(user), 1);
      //         // emit that a client got disconnected
      //         this.server.emit('user_disconnected', user.id);
      //     }
      // }
    } catch (error) {
    }
  }

  async updateUser(userId: number) {
    try {
      const user = this.users.find((user) => user.id === userId);
      if (user) {
        const newUser = await this.usersService.findUserById(userId);
        if (newUser) {
          user.displayName = newUser.displayName;
          user.avatar = newUser.avatar;
          user.enableTwoFactorAuth = newUser.enableTwoFactorAuth;
          user.status = newUser.status;
          const i = this.users.indexOf(user);
          this.users[i] = user;
        }
      }
    } catch (error) {
    };
  }

  newChannelCreated(channel: Channel) {
    this.server.emit('channel_created', channel);
  }

  async newMessage(newMessage: ConversationDto) {
    try {
      let user = this.users.find((user) => user.id === newMessage.to);
      let from = this.users.find((user) => user.id === newMessage.from);
      const conv = new Conversation();
      conv.receiver = await this.usersService.findUserById(newMessage.to);
      conv.sender = await this.usersService.findUserById(newMessage.from);
      conv.message = newMessage.message;
      await getManager().save(conv);
      if (user) {
        user.sockets.forEach((sock) => {
          sock.emit('new_message', newMessage);
        });
      }

      if (from) {
        from.sockets.forEach((sock) => {
          sock.emit('new_message', newMessage);
        });
      }
    } catch (error) {
    }
  }

  getUserBySocket(socket: Socket): UserType {
    // await this.users.forEach(user => {
    //     if (user.sockets.find(sock => sock.id === socket.id)) {
    //         return user;
    //     }
    // })
    // return null;
    for (let user of this.users) {
      if (user.sockets.find((sock) => sock.id === socket.id)) return user;
    }
    return null;
  }

  getSocketsByUserId(userId: number): Socket[] {
    let user = this.users.find((user) => user.id === userId);
    if (user) {
      return user.sockets;
    }
    return [];
  }

  getUserBySocketId(socket: string): UserType {
    // await this.users.forEach(user => {
    //     if (user.sockets.find(sock => sock.id === socket.id)) {
    //         return user;
    //     }
    // })
    // return null;
    for (let user of this.users) {
      if (user.sockets.find((sock) => sock.id === socket)) return user;
    }
    return null;
  }

  
}
