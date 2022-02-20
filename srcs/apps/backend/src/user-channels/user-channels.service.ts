import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Channel, { RelationChannel } from 'src/entities/channel.entity';
import UserChannel from 'src/entities/user-channel.entity';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserChannelsService {
    constructor(
                @InjectRepository(UserChannel) private userChannelRepository: Repository<UserChannel>,
                @InjectRepository(Channel) private channelRepository: Repository<Channel>,
                @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findAllUserChannel(channelId: number): Promise<any> {
        // const row = await this.userChannelRepository.query(`
        //     select * from users_channels
        //     where "users_channels"."channelId" = $1
        // `, [channelId]);

        let channel = await this.channelRepository.findOne({ id: channelId });
        if (!channel)
            throw new NotFoundException();
        return this.userChannelRepository.find({
            where: {
                channel
            },
            relations: ['user']
        })
    }

    async joinChannel(userId: number, channelId: number, password: string): Promise<any> {
        let channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['channelUsers', 'owner']
        });
        // join channel depends on the user and channel
        const user = await this.userRepository.findOne(userId);
        let userchannel = await this.userChannelRepository.findOne({
            where: {
                user,
                channel
            }
        });
    
        if (userchannel && userchannel.banned == true)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'user is banned'}, HttpStatus.FORBIDDEN);
        if (userchannel && channel.channelUsers.find(chan => chan.user == userchannel.user))
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'already joined'}, HttpStatus.FORBIDDEN);
        let joined = false;
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Channel not found'}, HttpStatus.NOT_FOUND);
        if (channel.type == 'private') {
            const isMatch = await bcrypt.compare(password, channel.password);
            if (isMatch)
                joined = true;
        }
        if ((channel && channel.type == 'private' && joined) || channel.type == 'public')
            userchannel = await this.userChannelRepository.create({
                user
            });
        else if (channel && channel.type == 'private' && !joined)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Invalid credientiel'}, HttpStatus.FORBIDDEN);
        if (channel.owner.id == userId && userchannel)
            userchannel.type = RelationChannel.OWNER;
        await this.userChannelRepository.save(userchannel);
        channel.channelUsers.push(userchannel);
        channel = await this.channelRepository.save(channel);
        return channel;
    }

    async leaveChannel(userId: number, channelId: number): Promise<any> {
        let channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['channelUsers', 'owner']
        });
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Channel not found'}, HttpStatus.NOT_FOUND);
        const user = await this.userRepository.findOne(userId);
        const userChannel = await this.userChannelRepository.findOne({
            where: {
                user,
                channel
            }
        });
        if (!userChannel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        await this.userChannelRepository.remove(userChannel);
        if (channel.owner.id == userId)
           await this.channelRepository.remove(channel);
        channel.id = channelId;
        return channel;
    }

    async deleteUserChannel(ownerId: number, relationId: number): Promise<any> {
        const relationchannel = await this.userChannelRepository.findOne({
            where: { id: relationId },
            relations: ['channel', 'user']
        });
        if (relationchannel) {
            if (relationchannel.user && ownerId == relationchannel.user.id) {
                const channel = relationchannel.channel;
                return await this.channelRepository.remove(channel);
            }
            return this.userChannelRepository.remove(relationchannel);
        } else {
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'relation with user channel not found'}, HttpStatus.NOT_FOUND)
        }
    }

    async kickUserChannel(channelId: number, userId: number): Promise<any> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        if (!user || !channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        const relationChannel = await this.userChannelRepository.findOne({
            user,
            channel,
        });
        if (relationChannel) {
            if (userId == channel.owner.id)
                throw new HttpException({status: HttpStatus.UNAUTHORIZED, error: 'action not allowed'}, HttpStatus.UNAUTHORIZED);
            await this.userChannelRepository.remove(relationChannel);
            return {
                userId,
                channelId
            };
        }
    }

    async getChannelByUser(userId: number): Promise<any> {
        try {
            return await this.channelRepository.query(`
                select * from "channels"
                where "id" IN (
                    SELECT DISTINCT "users_channels"."channelId"
                    FROM "users_channels" where "users_channels"."userId" = $1
                    and "users_channels"."banned" = false
                )
            `, [userId]);
        }catch(err) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'failed to get joined channels'
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async getChannelUserNotBelongTo(userId: number): Promise<any> {
        const row = await this.channelRepository.query(`
                select * from "channels"
                where "id" NOT IN (
                    SELECT DISTINCT "users_channels"."channelId"
                    FROM "users_channels" where "users_channels"."userId" = $1
                )
        `, [userId]);
        return row;
    }

    async banUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        if (!user || !channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);

        if (channel && channel.owner.id == userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'can\'t ban the owner'}, HttpStatus.FORBIDDEN);
        let row = await this.userChannelRepository.query(`
            update "users_channels"
            set "banned" = true
            where "users_channels"."channelId" = $1
            and "users_channels"."type" != $2
            and "users_channels"."userId" = $3
            returning *;
        `, [channelId, RelationChannel.OWNER, userId]);
        if (row[0].length == 0 && channel.owner.id != userId) {
            row = await this.userChannelRepository.query(`
                insert into "users_channels" (type, mutted, banned, "channelId", "userId")
                values ($1, $2, $3, $4, $5)
                returning *;
            `, [RelationChannel.NORMAL, false, true, channelId, userId]);
            return row;
        }
        return row[0];
    }

    async muteUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });

        if (!user || !channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel && channel.owner.id == userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'can\'t mute the owner'}, HttpStatus.FORBIDDEN);
        let row = await this.userChannelRepository.query(`
            update users_channels
            set "mutted" = true
            where "users_channels"."channelId" = $1
            and "users_channels"."type" != $2
            and "users_channels"."userId" = $3
            returning *;
        `, [channelId, RelationChannel.OWNER, userId]);

        return row[0];
    }

    async unBanUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        const userChannel = await this.userChannelRepository.findOne({
            where: { user, channel }
        })
        if (!user || !channel || !userChannel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);

        if (channel && channel.owner.id == userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'forbidden action'}, HttpStatus.FORBIDDEN);
        let row = await this.userChannelRepository.query(`
            update "users_channels"
            set "banned" = false
            where "users_channels"."channelId" = $1
            and "users_channels"."userId" = $2
            returning *;
        `, [channelId, userId]);
        return row[0][0];
    }

    async unMuteUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        const userChannel = await this.userChannelRepository.findOne({
            where: { user, channel }
        })
        if (!user || !channel || !userChannel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel && channel.owner.id == userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'forbidden action'}, HttpStatus.FORBIDDEN);
        let row = await this.userChannelRepository.query(`
            update users_channels
            set "mutted" = false
            where "users_channels"."channelId" = $1
            and "users_channels"."userId" = $2
            returning *;
        `, [channelId, userId]);

        return row[0][0];
    }

    async addAdminToChannel(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });

        if (!user || !channel)
            throw new HttpException({stattus: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel && channel.owner.id === userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'foridden action'}, HttpStatus.FORBIDDEN);
        const row = await this.userChannelRepository.query(`
            update users_channels
            set "type" = $1
            where "users_channels"."channelId" = $2
            and "users_channels"."userId" = $3
            returning *;
        `, [RelationChannel.ADMIN, channelId, userId]);
        return row[0][0];
    }
    async removeAdminFromChannel(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });

        if (!user || !channel)
            throw new HttpException({stattus: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel && channel.owner.id === userId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'foridden action'}, HttpStatus.FORBIDDEN);
        const row = await this.userChannelRepository.query(`
            update users_channels
            set "type" = $1
            where "users_channels"."channelId" = $2
            and "users_channels"."userId" = $3
            returning *;
        `, [RelationChannel.NORMAL, channelId, userId]);
        return row[0][0];
    }
    async userMuteUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        const userChannel = await this.userChannelRepository.findOne({
            where: { user, channel }
        })

        if (!user || !channel || !userChannel)
            throw new HttpException({stattus: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel.owner.id === userId || userChannel.type === RelationChannel.ADMIN)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'foridden action'}, HttpStatus.FORBIDDEN);
        const row = await this.userChannelRepository.query(`
            update users_channels
            set "mutted" = $1
            where "users_channels"."channelId" = $2
            and "users_channels"."userId" = $3
            returning *;
        `, [true, channelId, userId]);
        return row[0][0];
    }
    async userUnMuteUser(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        const userChannel = await this.userChannelRepository.findOne({
            where: { user, channel }
        })

        if (!user || !channel || !userChannel)
            throw new HttpException({stattus: HttpStatus.NOT_FOUND, error: 'not found'}, HttpStatus.NOT_FOUND);
        if (channel.owner.id === userId || userChannel.type === RelationChannel.ADMIN)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'foridden action'}, HttpStatus.FORBIDDEN);
        const row = await this.userChannelRepository.query(`
            update users_channels
            set "mutted" = $1
            where "users_channels"."channelId" = $2
            and "users_channels"."userId" = $3
            returning *;
        `, [false, channelId, userId]);
        return row[0][0];
    }
}
