import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Channel, { RelationChannel } from 'src/entities/channel.entity';
import UserChannel from 'src/entities/user-channel.entity';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/channel.dto';
import { ChannelUpdateDto } from './dto/channelUpdateDto';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { ChannelTypeDto } from './dto/channel.update.type.dto';

@Injectable()
export class ChannelsService {
    constructor(
                @InjectRepository(Channel) private channelRepository: Repository<Channel>,
                @InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(UserChannel) private userChannelRepository: Repository<UserChannel>
            ) {}
    
    async createChannel(userId: number, data: CreateChannelDto): Promise<Channel> {
        let channel = await this.channelRepository.findOne({
            where: { name: data.name }
        });
        if (channel)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Channel already exist'}, HttpStatus.FORBIDDEN);
        if (data.name.trim().length < 4 || data.name.trim().length > 10)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'failed to create channel'}, HttpStatus.FORBIDDEN);

        if (data.type == 'private') {
            if (data.password.trim().length > 3 && data.password.trim().length <= 10) {
                const salt = 10;
                const hash = await bcrypt.hash(data.password, salt);

                channel = await this.channelRepository.create({
                    name: data.name,
                    type: data.type,
                    password: hash
                });
            } else {
                throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'failed'}, HttpStatus.BAD_REQUEST);
            }
        } else if (data.type == 'public') {
            channel = await this.channelRepository.create({
                name: data.name,
                type: data.type,
            });
        }
        await this.channelRepository.save(channel);
        let user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ['ownedChannels']
        });
        channel = await this.channelRepository.findOne({
            where: { name: data.name },
            relations: ['channelUsers']
        });
        let userchannel;
        let row = await this.userChannelRepository.query(`
            select * from "users_channels" 
            where "users_channels"."channelId" = $1
            and "users_channels"."userId" = $2
        `, [channel.id, user.id]);
        if (row.length > 0) {
            user.ownedChannels.push(channel);
            await this.userRepository.save(user);
            return channel;
        } else {
            userchannel = await this.userChannelRepository.create({
                user,
                type: RelationChannel.OWNER
            });
            await this.userChannelRepository.save(userchannel);
            channel.channelUsers.push(userchannel);
            await this.channelRepository.save(channel);

            user.ownedChannels.push(channel);
            await this.userRepository.save(user);
            return channel;
        }
    }

    async findAll(): Promise<any> {
        const row = await this.channelRepository.query(`
            select * from channels
        `);
        return row;
        // const channels = await this.channelRepository.find({
        //     relations: ['owner']
        // });
        // return channels;
    }
    async findChannel(name: string): Promise<any> {
        const row = this.channelRepository.query(`
            select * from channels where channels.name = $1
        `, [name]);
        return row;
        // const channel = await this.channelRepository.findOne({
        //     where: { name: name },
        //     relations: ['owner']
        // });
        // if (!channel)
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        // return channel;
    }

    async addPasswordChannel(ownerId: number, channelId: number, passwordD: string): Promise<any> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Channel Not Found'}, HttpStatus.NOT_FOUND);
        else if (channel.type != "private")
            throw new HttpException({error: 'private mode is not enabled', status: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);
        else if (channel.owner.id != ownerId || (channel.owner.id == ownerId && passwordD.trim().length < 3))
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Channel update failed'}, HttpStatus.FORBIDDEN);
        const salt = 10;
        const hash = await bcrypt.hash(passwordD, salt);
        channel.password = hash;
        return await this.channelRepository.save(channel);
    }

    // update the visibility of the channel
    async updateChannelVisibility(ownerId: number, id: number, data: ChannelTypeDto): Promise<any> {
        const channel = await this.channelRepository.findOne({
            where: { id: id },
            relations: ['owner']
        });
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Channel Not Found'}, HttpStatus.NOT_FOUND);
        else if (channel.owner.id != ownerId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Unauthorized'}, HttpStatus.FORBIDDEN);
        const validate_error = await validate(data);
        if (validate_error.length > 0)
            throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'Invalid data'}, HttpStatus.BAD_REQUEST);
        if (data.type == 'public')
            channel.password = null;
        else if(data.type == 'private') {
            if (data.password.trim().length > 3 && data.password.trim().length <= 10) {
                const salt = 10;
                channel.password = await bcrypt.hash(data.password, salt);
            } else
                throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'failed'}, HttpStatus.BAD_REQUEST);
        }
        channel.type = data.type;
        const res = await this.channelRepository.save(channel);
        return res;
    }
    async deleteChannel(ownerId: number, channelId: number): Promise<any> {
        let channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['owner']
        });
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'channel not found'}, HttpStatus.NOT_FOUND);
        if (channel.owner.id != ownerId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'only channel\'s owner can delete this channel'}, HttpStatus.FORBIDDEN);
        // return await this.channelRepository.remove(channel);
        const row = await this.channelRepository.query(`
            delete from "channels" where "channels"."id" = $1
            and "channels"."ownerId" = $2
            returning *;
        `, [channelId, ownerId]);
        return row[0];
    }
    async updateChannel(ownerId: number, id: number, data: ChannelUpdateDto): Promise<any> {
        let channel = await this.channelRepository.findOne({
            where: { id: id },
            relations: ['owner']
        });
        if (!channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Channel not found'}, HttpStatus.NOT_FOUND);
        if (channel.owner.id != ownerId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'Unauthorized'}, HttpStatus.FORBIDDEN);
            const validate_error = await validate(data);
            if (validate_error.length > 0)
                throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'Invalid data'}, HttpStatus.BAD_REQUEST);
        channel.name = data.name;
        // channel.type = data.type;
        // if (data.type == 'public')
        //     channel.password = null;
        return await this.channelRepository.save(channel);
    }

    async makeUserAdmin(channelId: number, userId: number): Promise<any> {
        const user = await this.userRepository.findOne(userId);
        const channel = await this.channelRepository.findOne(channelId)
        if (!user || !channel)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Not found'}, HttpStatus.NOT_FOUND);
        const row = await this.userChannelRepository.query(`
            update users_channels
            set "type" = $1
            where "users_channels"."channelId" = $2
            and "users_channels"."type" != 'owner'
            and "users_channels"."userId" = $3
            returning *;
        `, [RelationChannel.ADMIN, channelId, userId]);
        return row[0];
    }

    async getUsersBannedFromChannel(channelId: number): Promise<any> {
        return await this.channelRepository.query(`
            select * from "users"
            where "id" in (
            select "users_channels"."userId" from "users_channels"
            where "users_channels"."channelId" = $1 and "users_channels"."banned" = true)
            `, [channelId]);
    }

    async getUsersMuttedFromChannel(channelId: number): Promise<any> {
        return await this.channelRepository.query(`
            select * from "users"
            where "id" in (
            select "users_channels"."userId" from "users_channels"
            where "users_channels"."channelId" = $1 and "users_channels"."mutted" = true)
            `, [channelId]);
    }
}
