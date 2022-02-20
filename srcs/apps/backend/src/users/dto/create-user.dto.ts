import { IsEmail, IsNotEmpty } from "class-validator";

export default class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;
    avatar?: string;

    type?: string;
}