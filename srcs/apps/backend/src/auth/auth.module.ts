import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import IntraStrategy from './intra.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { UserFriend } from 'src/entities/user-friend.entity';
import { MailService } from 'src/mail/mail.service';
import { ChatService } from 'src/chat/chat.service';


@Module({
  providers: [
    AuthService,
    IntraStrategy,
    JwtStrategy,
    UsersService,
    MailService,
    ChatService
  ],
  controllers: [AuthController],
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([User, UserFriend]),
    UsersModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET_KEY',
      signOptions: { expiresIn: 60*60*25 }
    })
  ],
  exports: [AuthService]
})
export class AuthModule {}
