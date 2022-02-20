import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Channel from 'src/entities/channel.entity';
import Message from 'src/entities/message.entity';
import { RelationFriend } from 'src/entities/user-friend.entity';
import User from 'src/entities/user.entity';
import { Repository, getConnection } from 'typeorm';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message) private messagesRepository: Repository<Message>,
        @InjectRepository(Channel) private channelsRepository: Repository<Channel>,
        @InjectRepository(User) private usersRepository: Repository<User>
    ) {}

    /**
     * Add message relation between channel and user many to many
     * @param username 
     * @param channelId 
     */
    async addMessage(username: string, channelId: number, messageDto: MessageDto) {
        try {
            let channel = await this.channelsRepository.findOne(channelId);
            let user = await this.usersRepository.findOne({ username });
            let message = new Message();
            message.body =  messageDto.message,
            message.channel =  channel,
            message.user =  user
            message = await getConnection().manager.save(message);
            return message;
        } catch (error) {
            throw error;
        }
    }

    async getMessages(id: number) {
        let channel = await this.channelsRepository.findOne(id);
        return this.messagesRepository.find({
            where: {
                channel: channel
            },
            relations: ['channel', 'user'],
            order: {
                id: 'ASC'
            }
        })
        // return await this.messagesRepository.query(`
        //     select * from "messages"
        //     inner join users on "messages"."userId" = "users"."id"
        //     inner join channels on "messages"."channelId" = "channels"."id"
        //     where "messages"."channelId" = $1
        //     order by "messages"."id" asc
        // `, [id]);
    }
    async getMessagesBelongToUser(channelId: number, userId: number): Promise<any> {
        const row = await this.messagesRepository.query(`
            select * from "messages"
            where "messages"."channelId" = $1
            and "messages"."userId" = $2
        `, [channelId, userId]);
        return row;
    }

    async getMessagesWithBlockedRelation(channelId: number, userId: number): Promise<any> {
        const row = await this.messagesRepository.query(`
            select "messages"."id" as id_message, * from messages inner join users on "users"."id" = "messages"."userId"
            where "messages"."channelId" = $1
            and "messages"."userId"
            not in ( select "recipientId" from "users_friends" where "applicantId" = $2
            and "status" = $3) and "messages"."userId" not in ( select "applicantId" from "users_friends" where "recipientId" = $2
            and "status" = $3 )
        `, [channelId, userId, RelationFriend.Blocked]);
        return row;
    }

    async deleteMessage(messageId: number): Promise<any> {
        const row = await this.messagesRepository.query(`
            delete from messages
            where "messages"."id" = $1
            returning *;
        `, [messageId]);
        return row[0];
    }
}
