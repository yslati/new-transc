import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import Channel from 'src/entities/channel.entity';
import { OwnerAuthGuard } from 'src/owner-auth.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/channel.dto';
import { ChannelTypeDto } from './dto/channel.update.type.dto';
import { ChannelUpdateDto } from './dto/channelUpdateDto';

@Controller('channels')
export class ChannelsController {
    constructor(private channelService: ChannelsService) {}

    // Get All Channels
    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<any> {
        return await this.channelService.findAll();
    }

    // Get a channel by name
    @Get('/:name')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async findChannel(@Param('name') name: string): Promise<any> {
        return await this.channelService.findChannel(name);
    }

    // Create a Channel
    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async createChannel(@Req() req, @Body() data: CreateChannelDto): Promise<Channel> {
        return await this.channelService.createChannel(req.user.user, data);
    }
    @Put('/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateChannel(@Req() req, @Param('id') id: string, data: ChannelUpdateDto): Promise<any> {
        return this.channelService.updateChannel(req.user.user, Number(id), data);
    }

    @Delete('/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async deleteChannel(@Req() req, @Param('id') id: string): Promise<any> {
        return this.channelService.deleteChannel(req.user.user, Number(id));
    }

    @Post('/:channelId/:userId')
    @HttpCode(200)
    @UseGuards(OwnerAuthGuard)
    @UseGuards(JwtAuthGuard)
    async makeUserAdmin(@Param('channelId', ParseIntPipe) channelId: string,
    @Param('userId', ParseIntPipe) userId: string
    ): Promise<any> {
        return this.channelService.makeUserAdmin(Number(channelId), Number(userId));
    }


    // add password to Channel
    @Patch('/addpassword/:channelId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async addChannelPassword(@Req() req, @Param('channelId', ParseIntPipe) channelId: string, @Body('password') data: string): Promise<any> {
        return this.channelService.addPasswordChannel(req.user.user, Number(channelId), data);
    }

    @Patch('/updatevisibility/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateChannelVisibility(@Req() req, @Param('id') id: string, @Body() data: ChannelTypeDto): Promise<any> {
        return this.channelService.updateChannelVisibility(req.user.user, Number(id), data);
    }

    @Get('/banned/:channelId')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    async getUsersBannedFromChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<any> {
        return this.channelService.getUsersBannedFromChannel(Number(channelId));
    }
    @Get('/mutted/:channelId')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    async getUsersMuttedFromChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<any> {
        return this.channelService.getUsersMuttedFromChannel(Number(channelId));
    }
}
