import {
    BadRequestException,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Req,
    Request,
    Res,
    UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from 'src/chat/chat.service';
import User from 'src/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { getConnection } from 'typeorm';
import { AuthService } from './auth.service';
import { IntraAuthGuard } from './intra-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
            private authService: AuthService,
            private usersService: UsersService,
            private mailService: MailService,
            private chatService: ChatService
        ) {
    }

    /**
     * @param req Nest Request
     * @param res Express Response
     */
    @Get()
    @UseGuards(IntraAuthGuard)
    async login(@Request() req, @Res() res: Response) {

        if (!req.user) {
            // redirect the user to frontend
            res.redirect(`${process.env.FRONTEND_URL}/login/error`);
            return;
        }
        // check if the user not exists and insert it
        let user = await this.usersService.findUserByUsername(req.user.username);
        if (!user) {
            user = await this.usersService.createUser({
                username: req.user.username,
                avatar: req.user.photos[0].value,
                email: req.user.emails[0].value,
            });
        } 
        if (user.banned) {
            return res.redirect(`${process.env.FRONTEND_URL}/404`);
        }
        else if (user.enableTwoFactorAuth == true) {
            try {
                let generatedCode = Math.floor(100000 + Math.random() * 900000);
                const u: User = await getConnection().manager.query(`
                    update users
                    set "verificationCode" = $1
                    where "users"."id" = $2
                    returning *;
                `, [generatedCode, user.id]);
                await this.mailService.sendUserVerivicationCode(u);
                res.redirect(`${process.env.FRONTEND_URL}/#/2fa`);
                return;
            } catch (error) {
               throw new BadRequestException('SMTP NOT GOOD');
            }
        }
        let result = await this.authService.login(user.id);
        res.cookie('token', result.access_token, { maxAge: 21600000 });
        res.redirect(`${process.env.FRONTEND_URL}/`);
    }

    @Get('/verification/:id')
    async verify(@Param('id', ParseIntPipe) id: string, @Res() res) {
        const user = await getConnection().manager.query(`
            select * from users where "verificationCode" = $1
        `, [parseInt(id)]);
        if (user.length) {
            let result = await this.authService.login(user[0].id);
            res.cookie('token', result.access_token, { maxAge: 21600000 });
            return res.redirect(`${process.env.FRONTEND_URL}/#/profile`);
        }
        return res.redirect(`${process.env.FRONTEND_URL}/login/error`);

    }

    /**
     * @param req Nest Request
     */
     @Get('logout')
     async logout(@Req() req, @Res() res: Response) {
        //  req.cookie('token', '');
        //  req.cookie('user', '');
         res.clearCookie('token');
        //  res.clearCookie('user');
        return res.redirect(`${process.env.FRONTEND_URL}/`)
     }
}
