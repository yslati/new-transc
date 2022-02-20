import { Length } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Message from "./message.entity";
import UserChannel from "./user-channel.entity";
import User from "./user.entity";

export enum RelationChannel {
    ADMIN = "admin",
    OWNER = "owner",
    NORMAL = "normal"
};

@Entity('channels')
export default class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: 'public' })
    type?: string;

    @Column({ nullable: true })
    password?: string;
    // owning a channel
    @ManyToOne(() => User, (e: User) => e.ownedChannels, { onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
    @JoinTable()
    owner: User;

    // // users who joined the channel
    @OneToMany(() => UserChannel, (e: UserChannel) => e.channel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    channelUsers: UserChannel[]

    // a channel has many messages
    @OneToMany(() => Message, (e: Message) => e.channel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    channelMessages: Message[];
}