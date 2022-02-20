import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

export enum RelationFriend {
    Pending = 'pending',
    Accepted = 'accepted',
    Blocked = 'blocked'
}

@Entity('users_friends')
export class UserFriend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (e: User) => e.sentFriendRequests, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'applicantId' })
    applicant: User;

    @ManyToOne(() => User, (e: User) => e.receivedFriendRequests, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'recipientId' })
    recipient: User;

    @Column({ default: RelationFriend.Pending })
    status?: RelationFriend;
}