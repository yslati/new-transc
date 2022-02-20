import { forwardRef, Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.enitity';
import User from 'src/entities/user.entity';
import { AppModule } from 'src/app.module';

@Module({
  providers: [ConversationService],
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([User, Conversation])
  ],
  exports: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
