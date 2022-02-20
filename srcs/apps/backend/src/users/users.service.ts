import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { RelationFriend, UserFriend } from 'src/entities/user-friend.entity';
import User, { UserStatus } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
            @InjectRepository(User) private usersRepository: Repository<User>,
            @InjectRepository(UserFriend) private userFriendRepository: Repository<UserFriend>
        ) {}
    
    async cancelInvitation(userId: number, invitationId: number) {
        let recepient = await this.usersRepository.findOne(userId);
        let applicant = await this.usersRepository.findOne(invitationId);
        const invite = await this.userFriendRepository.findOne({
            where: {
                recipient: recepient,
                applicant: applicant
            }
        });
        if (!invite) {
                throw new NotFoundException();
        }
        await this.userFriendRepository.remove(invite)
        return applicant;
        // throw new BadRequestException();
    }
    
    async getLeaderBoard(): Promise<any> {
        return this.usersRepository.find({
            order: { score: 'DESC' }
        })
    }
    async updateScore(userId: number, score: number) {
        const user = await this.usersRepository.findOne(userId);
        if (!user)
            throw new NotFoundException();
        user.score += score;
        await this.usersRepository.save(user);
    }

    async createUser(data: any): Promise<any> {
        const validate_error = await validate(data);
        if (validate_error.length > 0)
            throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'Input data validation failed'}, HttpStatus.BAD_REQUEST);
        const users = await this.usersRepository.find();
        if (users && users.length == 0) {
            data["type"] = 'owner';
        }
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async checkIsBlocked(currentId: number, userId: number): Promise<boolean> {

        const current: User = await this.usersRepository.findOne(currentId);
        const other: User = await this.usersRepository.findOne(userId);
        let result = await this.userFriendRepository.findOne({
            where: [
                {
                    applicant: current,
                    recipient: other,
                },
                {
                    applicant: other,
                    recipient: current,
                }
            ]
        });
        if (result) {
            if (result.status === RelationFriend.Blocked) {
                return true;
            }
        }
        return false;
    }

    async findUserById(id: number): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { id: id }
        });
        if (!user)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Not found'}, HttpStatus.NOT_FOUND);
        return user;
    }
    async findUserByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: { username }
        });
    }


    async updateUser(ownerId: number, data: UpdateUserDto): Promise<User> {
        const validate_error = await validate(data);
        if (validate_error.length > 0)
            throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'Input data validation failed'}, HttpStatus.BAD_REQUEST);
        let user = await this.usersRepository.findOne({
            where: { displayName: data.displayName }
        });
        if (user && user.id !== ownerId)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'DisplayName already taken'}, HttpStatus.FORBIDDEN);
        // if (!user)
        //     throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'Not found'}, HttpStatus.NOT_FOUND);
        user = await this.usersRepository.findOne(ownerId);
        user.displayName = data.displayName;
        user.enableTwoFactorAuth = data.enableTwoFactorAuth;
        return this.usersRepository.save(user);
    }

    async uploadAvatar(ownerId: number, avatar: string): Promise<User> {
        let user = await this.usersRepository.findOne(ownerId);

        user.avatar = avatar;
        return await this.usersRepository.save(user);
    }

    async removeUser(id: number): Promise<any> {
        const user = await this.usersRepository.findOne(id);
        if (!user)
            throw new HttpException({status: HttpStatus.BAD_REQUEST, error: 'User not found'}, HttpStatus.BAD_REQUEST);
        return await this.usersRepository.remove(user);
    }

    async enableTwoFactorAuth(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
            update users
            set "enableTwoFactorAuth" = $2
            where "users"."id" = $1
            returning *;
        `, [userId, true]);
        return row[0][0];
    }

    async disableTwoFactorAuth(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
            update users
            set "enableTwoFactorAuth" = $2
            where "users"."id" = $1
            returning *;
        `, [userId, false]);
        return row[0][0];
    }

    async sendRequest(applicantId: number, recipientId: number): Promise<any> {
        const sender = await this.usersRepository.findOne({
            where: { id: applicantId },
            relations: ['sentFriendRequests']
        });
        const receiver = await this.usersRepository.findOne({
            where: { id: recipientId },
            relations: ['receivedFriendRequests']
        });
        if (!receiver)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'user not found'}, HttpStatus.NOT_FOUND);
        let friendship = await this.userFriendRepository.findOne({
            where: [
                { applicant: sender, recipient: receiver },
                { applicant: receiver, recipient: sender }
            ]
        });
        if (friendship)
            throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'relationfriend already exists'}, HttpStatus.FORBIDDEN);
        friendship = await this.userFriendRepository.create({
            applicant: sender,
            recipient: receiver,
        });
        return await this.userFriendRepository.save(friendship);
    }

    async updateStatus(userId: number, status: UserStatus) {
        let user = await this.usersRepository.findOne(userId);
        if (user) {
            user.status = status;
            user = await this.usersRepository.save(user);
        }
    }


    async acceptFriendRequest(recipientId: number, applicantId: number): Promise<any> {
        const sender = await this.usersRepository.findOne({
            where: { id: applicantId }
        });
        if (!sender)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'user not found'}, HttpStatus.NOT_FOUND);
        const receiver = await this.usersRepository.findOne({
            where: { id: recipientId }
        });
        let friendship = await this.userFriendRepository.findOne({
            where: { applicant: sender, recipient: receiver }
        });
        if (!friendship)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'friendship not found'}, HttpStatus.NOT_FOUND);
        friendship.status = RelationFriend.Accepted;
        await this.userFriendRepository.save(friendship);
        return sender; 
    }

    async blockUser(applicantId: number, blockedId: number): Promise<any> {
        const applicant = await this.usersRepository.findOne({
            where: { id: applicantId },
        });

        const blockedUser = await this.usersRepository.findOne({
            where: { id: blockedId }
        });
        if (!blockedUser)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'user not found'}, HttpStatus.NOT_FOUND);
        const friendship = await this.userFriendRepository.findOne({
            where: [
                { applicant: applicant, recipient: blockedUser },
                { applicant: blockedUser, recipient: applicant }
            ]
        });

        if (friendship) {
            friendship.status = RelationFriend.Blocked;
            return await this.userFriendRepository.save(friendship);
        } else {
            let friendship = await this.userFriendRepository.create({
                applicant: applicant,
                recipient: blockedUser,
            });
            friendship.status = RelationFriend.Blocked;
            await this.userFriendRepository.save(friendship);
            return blockedUser;
        }
    }

    async removeFriendShip(applicantId: number, removedId: number): Promise<any> {
        const applicant = await this.usersRepository.findOne({
            where: { id: applicantId }
        });
        const removedUser = await this.usersRepository.findOne({
            where: { id: removedId }
        });
        if (!removedUser)
            throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'user not found'}, HttpStatus.NOT_FOUND);
        const friendship = await this.userFriendRepository.findOne({
            where: { applicant: applicant, recipient: removedUser }
        });

        return await this.userFriendRepository.remove(friendship);
    }

    async getFriends(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from "users"
        where "users"."id" IN (SELECT "applicantId" FROM "users_friends" WHERE "recipientId"= $2 and "status" = $1)
        OR "users"."id" IN (SELECT "recipientId" FROM "users_friends" WHERE "applicantId"= $2  and "status" = $1)
        `, ["accepted", userId]);
        return row;
    }

    async findRequestFriends(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from "users"
        where "users"."id" IN (SELECT "applicantId" FROM "users_friends" WHERE "recipientId"= $2 and "status" = $1)
        OR "users"."id" IN (SELECT "recipientId" FROM "users_friends" WHERE "applicantId"= $2  and "status" = $1)
        `, ["pending", userId]);
        return row;
    }

    async findFriendRequestPending(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from "users"
        where "users"."id" IN (SELECT "applicantId" FROM "users_friends" WHERE "recipientId"= $2  and "status" = $1)
        `, ["pending", userId]);
        return row;
    }

    // two way search
    async findBlockedFriends(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from "users"
        where "users"."id" IN (SELECT "applicantId" FROM "users_friends" WHERE "recipientId"= $2 and "status" = $1)
        OR "users"."id" IN (SELECT "recipientId" FROM "users_friends" WHERE "applicantId"= $2  and "status" = $1)
        `, ["blocked", userId]);
        return row;
    }

    async blockedFriends(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from "users"
        where "users"."id" IN (SELECT "recipientId" FROM "users_friends" WHERE "applicantId"= $2 and "status" = $1)
        `, ["blocked", userId]);
        return row;
    }


    async findFrinedsNoRelation(userId: number): Promise<any> {
        const row = await this.usersRepository.query(`
        select * from users
        where "users"."id" != $1 and "users"."id" not in
        (select "applicantId" from "users_friends" where "recipientId" = $1 and ("status" = 'pending'
        or "status" = 'accepted' or "status" = 'blocked'))
        and "users"."id" not in
        (select "recipientId" from "users_friends" where "applicantId" = $1 and ("status" = 'pending'
        or "status" = 'accepted' or "status" = 'blocked'))

        `, [userId]);
        return row;
    }
    // blocked, 11 -> 1

    async verfiyCode(verificationCode: number): Promise<any> {

    }

}