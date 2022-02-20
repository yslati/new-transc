import { BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity('conversation')
export class Conversation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (e: User) => e.sentMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    sender: User;

    @ManyToOne(() => User, (e: User) => e.recievedMessages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable()
    receiver: User;

    @Column()
    message: string;
}