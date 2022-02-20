import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UsersService } from './users.service';
import { editFileName, imageFileFilter } from '../utils/imageFileFilter';
import User from 'src/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();


@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Get('/cancel_invitation/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    cancelInvitation(@Param('id', ParseIntPipe) id: number, @Req() req) {
        return this.userService.cancelInvitation(req.user.user, id);
    }

    @Get('/blocked-users')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async getBlockedUsers(@Req() req) {
        return this.userService.findBlockedFriends(req.user.user);
    }

    @Get('/profile/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async getProfile(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<any> {
        if (await this.userService.checkIsBlocked(req.user.user, id))
            throw new BadRequestException();
        return this.userService.findUserById(id);
    }

    @Get('/leaderboard')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    getLeaderBoard(): Promise<any> {
        return this.userService.getLeaderBoard();
    }

    @Put()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async updateUser(@Req() req, @Body() data: UpdateUserDto): Promise<any> {
        if (data.displayName.trim().length < 5) {
            throw new BadRequestException();
        }
        return this.userService.updateUser(req.user.user, data)
    }

    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.userService.findAll();
    }

    @Post('/register')
    @HttpCode(201)
    async createUser(@Body() data: CreateUserDto): Promise<any> {
        return await this.userService.createUser(data);
    }

    @Post('/twoFa-verify')
    @HttpCode(200)
    async verifyCode(@Body('verificationCode') verificationCode: number): Promise<any> {
        return this.userService.verfiyCode(verificationCode);
    }

    @Get('me')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    me(@Req() req) {
        return this.userService.findUserById(req.user.user);
    }

    @Post('avatar')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar', {
        fileFilter: imageFileFilter,
        storage: diskStorage({
            destination: 'uploads/',
            filename: editFileName
        }),
    }))
    uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File): Promise<User> {
        return this.userService.uploadAvatar(req.user.user, process.env.BACKEND_URL + file.filename);
    }

    // FRIEND REQUEST
    @Post('/:recipientId')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    sendRequest(@Req() req, @Param('recipientId', ParseIntPipe) id: string): Promise<any> {
        return this.userService.sendRequest(req.user.user, Number(id));
    }

    @Patch('/:applicantId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    acceptRequest(@Req() req, @Param('applicantId', ParseIntPipe) id: string): Promise<any> {
        return this.userService.acceptFriendRequest(req.user.user, Number(id));
    }

    @Put('/enable-twofa')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async enableTwoFa(@Req() req): Promise<any> {
        return this.userService.enableTwoFactorAuth(req.user.user);
    }

    @Put('/disable-twofa')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async disableTwoFa(@Req() req): Promise<any> {
        return this.userService.disableTwoFactorAuth(req.user.user);
    }

    @Post('/block/:userId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async blockFriend(@Req() req, @Param('userId', ParseIntPipe) userId: string): Promise<any> {
        return this.userService.blockUser(req.user.user, Number(userId));
    }

    @Get('/friends-pending')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    findRequestFriends(@Req() req) {
        // return this.userService.findRequestFriends(req.user.user);
        return this.userService.findFriendRequestPending(Number(req.user.user));
    }

    @Get('/friends-accepted')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    getMyFriends(@Req() req): Promise<any> {
        return this.userService.getFriends(req.user.user);
    }

    @Get('/blocked-friends')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    getBlockedFriends(@Req() req): Promise<any> {
        // return this.userService.findBlockedFriends(req.user.user);
        return this.userService.blockedFriends(req.user.user);
    }

    @Get('/friends-noRelation')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    getUsersNoRelation(@Req() req): Promise<any> {
        return this.userService.findFrinedsNoRelation(req.user.user);
    }
}
