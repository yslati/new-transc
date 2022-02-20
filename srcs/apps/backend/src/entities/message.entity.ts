import { BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./channel.entity";
import User from "./user.entity";

@Entity('messages')
export default class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, (e: User) => e.channelMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    user: User;

    @ManyToOne(() => Channel, (e: Channel) => e.channelMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    channel: Channel;

    @Column()
    body: string;
}