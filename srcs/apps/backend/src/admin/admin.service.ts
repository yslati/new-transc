import {
    HttpException,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import Channel from 'src/entities/channel.entity';
import { RelationFriend } from 'src/entities/user-friend.entity';
import User, { UserRole } from 'src/entities/user.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class AdminService {
    async getAllUsers(userId: number): Promise<User[]> {
        return await getConnection().manager.query(`
            select * from "users"
			where "users"."type" != 'owner'
			and "users"."id" != $1
			order by "users"."id" asc
			`, [userId]);
			// and "users"."banned" = false
    }

    async deleteUser(userId: number): Promise<User> {
		let user = await getConnection().manager.query(`
			select * from users
			where "users"."id" = $1
		`, [userId]);
		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found'
				},
				HttpStatus.NOT_FOUND
			);
		}
		if (user.type == UserRole.OWNER) {
			throw new HttpException(
				{
					status: HttpStatus.FORBIDDEN,
					error: 'Can\'t delete the owner of the website'
				},
				HttpStatus.FORBIDDEN
			);
		}
        const row = await getConnection().manager.query(`
            delete from users
            where "users"."id" = $1
            and "users"."type" != 'owner'
            returning *;
        `, [userId]);
		return row[0][0];
    }

    async deleteChannel(channelId: number): Promise<Channel> {
        let channel = await getConnection().manager.query(`
            select * from channels
            where "channels"."id" = $1
        `, [channelId]);
        if (!channel)
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: 'Channel not found'
                },
                HttpStatus.NOT_FOUND)
        channel = await getConnection().manager.query(`
            delete from channels
			where "channels"."id" = $1
			returning *;
        `, [channelId]);

        return channel[0][0];
    }

	async banUser(userId: number): Promise<any> {
		let user = await getConnection().manager.query(`
			select * from users
			where "users"."id" = $1
		`, [userId]);
		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found'
				},
				HttpStatus.NOT_FOUND
			);
		}
		if (user.type == UserRole.OWNER) {
			throw new HttpException(
				{
					status: HttpStatus.FORBIDDEN,
					error: 'Can\'t ban the owner of the website'
				},
				HttpStatus.FORBIDDEN
			);
		}
		user = await getConnection().manager.query(`
			update users
			set "banned" = true
			where "users"."id" = $1
			returning *;
		`, [userId]);
		return user[0][0];
    }

	async undoBanUser(userId: number): Promise<any> {
		let user = await getConnection().manager.query(`
			select * from users
			where "users"."id" = $1
		`, [userId]);
		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found'
				},
				HttpStatus.NOT_FOUND
			);
		}
		user = await getConnection().manager.query(`
			update users
			set "banned" = false
			where "users"."id" = $1
			returning *;
		`, [userId]);
		return user[0][0];
    }

	async getAllChannels(): Promise<any> {
		return await getConnection().manager.query(`
			select * from channels
		`);
	}

	async addAdminToWebSite(userId: number): Promise<any> {
		let user = await getConnection().manager.query(`
			select * from users
			where "users"."id" = $1
			and "users"."type" = 'user'
		`, [userId]);
		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found'
				},
				HttpStatus.NOT_FOUND
			);
		}
		user = await getConnection().manager.query(`
			update users
			set "type" = $2
			where "users"."id" = $1
			returning *;
		`, [userId, UserRole.ADMIN]);

		return user[0][0];
	}
	async removeAdminfromWebSite(userId: number): Promise<any> {
		let user = await getConnection().manager.query(`
			select * from users
			where "users"."id" = $1
			and "users"."type" = 'admin'
		`, [userId]);
		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found'
				},
				HttpStatus.NOT_FOUND
			);
		}
		user = await getConnection().manager.query(`
			update users
			set "type" = $2
			where "users"."id" = $1
			returning *;
		`, [userId, UserRole.USER]);
		return user[0][0];
	}

	// give rights except removing ownership of the channel
	async giveRightsToUserBelongToChannel(channelId: number, userId: number): Promise<any> {
		const row = await getConnection().manager.query(`
			update users_channels
			set "type" = 'admin'
			where "users_channels"."channelId" = $1
			and "users_channels"."userId" = $2
			and "users_channels"."type" != 'owner'
		`, [channelId, userId]);
		return row[0][0];
	}

	async removeRightsFromUserBelongToChannel(channelId: number, userId: number): Promise<any> {
		// remove rights to a user
		const row = await getConnection().manager.query(`
			update users_channels
			set "type" = 'normal'
			where "users_channels"."channelId" = $1
			and "users_channels"."userId" = $2
			and "users_channels"."type" != 'owner'
		`, [channelId, userId]);
		return row[0][0];
	}

	async getUserFriends(userId: number): Promise<any> {
		const row = await getConnection().manager.query(`
			select * from users
			where "users"."id" in ( select "applicantId" from users_friends where "users_friends"."recipientId" = $1 and "users_friends"."status" = $2 )
			or "users"."id" in ( select "recipientId" from users_friends where "users_friends"."applicantId" = $1 and "users_friends"."status" = $2 )
		`, [userId, RelationFriend.Accepted]);
		return row;
	}
	
	async getAllUsersBelongToChannel(channelId: number): Promise<any> {
		const row = await getConnection().manager.query(`
		select * from users
		where "users"."id" in ( select "userId" from users_channels where "users_channels"."channelId" = $1 )
		`, [channelId]);
		return row;
	}

	async getAllAdminsBelongToChannel(channelId: number): Promise<any> {
		const row = await getConnection().manager.query(`
			select * from users
			where "users"."id" in ( select "userId" from users_channels where "users_channels"."channelId" = $1 and "users_channels"."type" = $2 )
		`, [channelId, 'admin']);
		return row;
	}

	async getAllUsersNotAdminBelongToChannel(channelId: number): Promise<any> {
		const row = await getConnection().manager.query(`
			select * from users
			where "users"."id" in ( select "userId" from users_channels where "users_channels"."channelId" = $1 and "users_channels"."type" = 'normal' )
		`, [channelId]);
		return row;
	}
}
