import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { UsersService } from "src/users/users.service";
import * as dotenv from 'dotenv';

dotenv.config();

export default class IntraStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_SECRET_ID,
			callbackURL: `${process.env.BACKEND_URL}/auth`,
            scope: 'public'
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any
        ) {
        return {
            token: accessToken,
            ...profile
        };
    }
}
