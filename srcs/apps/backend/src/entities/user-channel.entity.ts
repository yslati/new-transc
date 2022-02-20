import {
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

import Channel, { RelationChannel } from "./channel.entity";
import User from "./user.entity";

@Entity('users_channels')
export default class UserChannel {
    @PrimaryGeneratedColumn()
    id?: number;

    // many users belong to a channel
    @ManyToOne(() => Channel, (e: Channel) => e.channelUsers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    channel: Channel

    @ManyToOne(() => User, (e: User) => e.userChannels, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    user: User;

    @Column({ type: 'enum', default: RelationChannel.NORMAL, enum: RelationChannel  })
    type: RelationChannel;

    @Column({ default: false })
    mutted?: boolean;

    @Column({ default: false })
    banned?: boolean;
}