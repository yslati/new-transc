import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.enitity';
import User from 'src/entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { ConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async getConversation(senderId: number, receiverId: number): Promise<Conversation[]> {
        const sender = await this.userRepository.findOne({
            where: { id: senderId },
        })
        const receiver = await this.userRepository.findOne({
            where: { id: receiverId }
        });
        // return await this.conversationRepository.find({
        //     where: { sender, receiver },
        // });

        // TODO check the relationship

        let res = await this.conversationRepository.find({
            where: [
                {
                    sender,
                    receiver
                },
                {
                    sender: receiver,
                    receiver: sender
                }
            ],
            relations: ['sender']
        });

        // const row = await getConnection().manager.query(`
        //     select * from conversation
        //     where ("conversation"."senderId" = $1 and "conversation"."receiverId" = $2
        //     or "conversation"."senderId" = $2 and "conversation"."receiverId" = $1)
        //     and "conversation"."receiverId"
        //     in (select "recipientId" from users_friends
        //     where "users_friends"."applicantId" = $1
        //     and "users_friends"."status" = 'accepted')
        //     or "conversation"."receiverId"
        //     in (select "applicantId" from users_friends
        //     where "users_friends"."recipientId" = $1
        //     and "users_friends"."status" = 'accepted')
        // `, [senderId, receiverId]);
        return res;
    }

    async saveConversation(senderId: number, receiverId: number, conv: ConversationDto): Promise<any> {
        // sender -> user who logged in
        const sender = await this.userRepository.findOne({
            where: { id: senderId },
        });
        const receiver = await this.userRepository.findOne({
            where: { id: receiverId }
        });
        // let conversation = await this.conversationRepository.findOne({
        //     where: [
        //         { sender, receiver },
        //     ]
        // });

        // if (!conversation) {
        let conversation = await this.conversationRepository.create({
                sender,
                receiver,
                message: conv.message,
            });
        conversation = await this.conversationRepository.save(conversation)
        //     conversation = await this.conversationRepository.save(conversation);
        // } else {
        //     conversation.message = conv.message;
        //     conversation = await this.conversationRepository.save(conversation);
        // }
        return conversation;
    }
}
