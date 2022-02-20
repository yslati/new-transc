import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageDto } from './dto/message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

    constructor(private messageServices: MessagesService) {}

    /**
     * @param id Channel Id
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getMessages(@Param('id', ParseIntPipe) id: number) {
        return this.messageServices.getMessages(id);
    }
    /**
     * @param id channel Id
     * @req req.user.username the logged user's username
     */
    @Post(':id')
    @UseGuards(JwtAuthGuard)
    addMessage(@Param('id', ParseIntPipe) id: string, @Body() message: MessageDto) {
        return this.messageServices.addMessage("test", Number(id), message);
    }
    /**
     * @param id Channel Id
     * @param userId User Id
     */
    @Get('/user-msg/:channelId/:userId')
    @UseGuards(JwtAuthGuard)
    getMessagesBelongToUser(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.messageServices.getMessagesBelongToUser(Number(channelId), Number(userId));
    }

    @Get('/all-but-blocked/:channelId/:userId')
    @UseGuards(JwtAuthGuard)
    getMessagesWithBlockedRelation(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.messageServices.getMessagesWithBlockedRelation(Number(channelId), Number(userId));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteMessage(@Param('id', ParseIntPipe) id: string): Promise<any> {
        return this.messageServices.deleteMessage(Number(id));
    }
}
