import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'trans.alex1111@gmail.com',
          pass: 'azazaz123@@',
        },
      },
      defaults: {
        from: 'tansandance@gmail.com',
      },
      // template: {
      //   // dir: join(__dirname, 'templates'),
      //   // // adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   }
      // }
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
