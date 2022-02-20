import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import UserChannel from "./user-channel.entity";
import Channel from "./channel.entity";
import { UserFriend } from "./user-friend.entity";
import Message from "./message.entity";
import Game from "./game.enity";
import { Conversation } from "./conversation.enitity";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    OWNER = 'owner',
}
export enum UserStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'in game'
}

@Entity("users")
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email?: string;

    @Column()
    username: string;

    @Column({ nullable: true, unique: true })
    displayName: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: false })
    enableTwoFactorAuth: boolean;

    @Column({ nullable: true })
    verificationCode?: number;
    
    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.OFFLINE })
    status: UserStatus;
    
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    type: UserRole;

    @Column({ default: false })
    banned: boolean;

    // Friend Request
    @OneToMany(() => UserFriend, (e: UserFriend) => e.applicant, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    sentFriendRequests: UserFriend[];

    @OneToMany(() => UserFriend, (e: UserFriend) => e.recipient, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    receivedFriendRequests: UserFriend[];

    // owning a channel
    // { cascade: ['insert', 'remove', 'update'] }
    @OneToMany(() => Channel, (e: Channel) => e.owner, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    ownedChannels: Channel[];



    @OneToMany(() => UserChannel, (e: UserChannel) => e.user)
    // @JoinTable()
    userChannels: UserChannel[];


    // Many messages on a channel
    @OneToMany(() => Message, (e: Message) => e.user)
    channelMessages: Message[]
    
    // private Converstaion
    @OneToMany(() => Conversation, (e: Conversation) => e.sender)
    sentMessages: Conversation[];
    
    @OneToMany(() => Conversation, (e: Conversation) => e.receiver)
    recievedMessages: Conversation[];

    // Game
    @OneToMany(() => Game, (e: Game) => e.player1)
    @JoinTable()
    userGame: Game[];

    @OneToMany(() => Game, (e: Game) => e.player2)
    @JoinTable()
    reversedGame: Game[];

    @Column({ default: 0 })
    score: number;
}
