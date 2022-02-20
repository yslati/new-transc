import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param, 
    ParseIntPipe,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnerAuthGuard } from 'src/owner-auth.guard';
import { UserChannelsService } from './user-channels.service';

@Controller('user-channels')
export class UserChannelsController {
    constructor(private userChannelService: UserChannelsService) {}

    @Get('/users_belongs_to/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    findAllUserChannel(@Param('id', ParseIntPipe) id: string): Promise<any> {
        return this.userChannelService.findAllUserChannel(Number(id));
    }

    @Post('/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    joinChannel(@Req() req, @Param('id') id: string, @Body('password') password: string): Promise<any> {
        return this.userChannelService.joinChannel(req.user.user, Number(id), password);
    }

    @Get('/leave/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    leaveChannel(@Req() req, @Param('id') id: string): Promise<any> {
        return this.userChannelService.leaveChannel(req.user.user, Number(id));   
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    deleteUserChannel(@Req() req, @Param('id', ParseIntPipe) id: string): Promise<any> {
        return this.userChannelService.deleteUserChannel(req.user.user, Number(id));
    }

    @Delete('/kick/:channelId/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    kickUserChannel(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Param('id', ParseIntPipe) id: string): Promise<any> {
        return this.userChannelService.kickUserChannel(Number(channelId), Number(id));
    }

    @Get('/channels-belongto')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getChannelByUser(@Req() req): any {
        return this.userChannelService.getChannelByUser(req.user.user);
    }

    @Get('/channels-notbelongto')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getAllChannelsUserNotBelongTo(@Req() req): Promise<any> {
        return this.userChannelService.getChannelUserNotBelongTo(req.user.user);
    }


    @Get('/ban/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    async banUser(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.banUser(Number(channelId), Number(userId));
    }

    @Get('/mute/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    muteUser(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.muteUser(Number(channelId), Number(userId));
    }

    @Get('/unban/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    unBanUser(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.unBanUser(Number(channelId), Number(userId));
    }

    @Get('/unmute/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    unMuteUser(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.unMuteUser(Number(channelId), Number(userId));
    }

    @Get('/add-admin/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    addAdminToChannel(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.addAdminToChannel(Number(channelId), Number(userId));
    }

    @Get('/remove-admin/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    removeAdminFromChannel(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.removeAdminFromChannel(Number(channelId), Number(userId));
    }

    @Get('/user-mute-user/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    userMuteUser(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.userMuteUser(Number(channelId), Number(userId));
    }

    @Get('/user-unmute-user/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    userUnMuteUser(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userChannelService.userUnMuteUser(Number(channelId), Number(userId));
    }
}
