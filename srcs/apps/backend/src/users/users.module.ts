import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppModule } from 'src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { UserFriend } from 'src/entities/user-friend.entity';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([User, UserFriend])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
