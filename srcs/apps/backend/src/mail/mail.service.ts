import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import User from 'src/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserVerivicationCode(user: User) {
        await this.mailerService.sendMail({
            to: user[0][0].email,
            subject: 'Your Verification Code',
            html: `Here your verification link: <a href='${process.env.BACKEND_URL}/auth/verification/${user[0][0].verificationCode}'>Go to profile</a>`,
            context: {
                name: user.username,
            }
        })
    }
}
