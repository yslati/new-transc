import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import Channel from 'src/entities/channel.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import User, { UserRole } from 'src/entities/user.entity';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { ChatService } from 'src/chat/chat.service';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Get('users')
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HttpCode(200)
    async getAllUsers(@Req() req): Promise<User[]> {
        return this.adminService.getAllUsers(req.user.user);
    }

	@Delete('/users/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async deleteUser(@Param('userId', ParseIntPipe) userId: string): Promise<User> {
	
		return this.adminService.deleteUser(Number(userId));
	}

	@Get('channels')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async getAllChannels(): Promise<User[]> {
		return this.adminService.getAllChannels();
	}

    @Delete('channels/:channelId')
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @HttpCode(200)
    async deleteChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<Channel> {
        return this.adminService.deleteChannel(Number(channelId));
    }

    @Patch('ban-user/:userId')
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async banUser(@Param('userId', ParseIntPipe) userId: string): Promise<any> {
				return this.adminService.banUser(Number(userId));
	}

	@Patch('undoban-user/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async undoBanUser(@Param('userId', ParseIntPipe) userId: string): Promise<any> {
		return this.adminService.undoBanUser(Number(userId));
	}

	@Patch('add-admin/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async addAdminToWebSite(@Param('userId', ParseIntPipe) userId: string): Promise<any> {
		return this.adminService.addAdminToWebSite(Number(userId));
	}

	@Patch('remove-admin/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async removeAdmin(@Param('userId', ParseIntPipe) userId: string): Promise<any> {
		return this.adminService.removeAdminfromWebSite(Number(userId));
	}

	@Patch('give-rights/:channelId/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async giveRights(@Param('channelId', ParseIntPipe) channelId: string,
	@Param('userId', ParseIntPipe) userId: string): Promise<any> {
		return this.adminService.giveRightsToUserBelongToChannel(Number(channelId), Number(userId));
	}

	@Patch('remove-rights/:channelId/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async removeRights(@Param('channelId', ParseIntPipe) channelId: string,
	@Param('userId', ParseIntPipe) userId: string): Promise<any> {
		return this.adminService.removeRightsFromUserBelongToChannel(Number(channelId), Number(userId));
	}

	@Get('/users/:userId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async getUserFriends(@Param('userId', ParseIntPipe) userId: string) {
		return this.adminService.getUserFriends(Number(userId));
	}

	@Get('channels/:channelId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async getAllUsersBelongToChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<User[]> {
		return this.adminService.getAllUsersBelongToChannel(Number(channelId));
	}

	@Get('channels/admins/:channelId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async getAllAdminsBelongToChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<User[]> {
		return this.adminService.getAllAdminsBelongToChannel(Number(channelId));
	}

	@Get('channels/users/:channelId')
	@Roles(UserRole.OWNER, UserRole.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@HttpCode(200)
	async getAllUsersNotAdminBelongToChannel(@Param('channelId', ParseIntPipe) channelId: string): Promise<User[]> {
		return this.adminService.getAllUsersNotAdminBelongToChannel(Number(channelId));
	}
}
