import { Controller, Get, HttpCode, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Conversation } from 'src/entities/conversation.enitity';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
    constructor(private conversationService: ConversationService) {}
    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async getConversation(@Req() req, @Param('id', ParseIntPipe) id: string): Promise<Conversation[]> {
        return this.conversationService.getConversation(req.user.user, Number(id));
    }
}
