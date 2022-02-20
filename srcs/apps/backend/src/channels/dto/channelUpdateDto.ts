import { IsNotEmpty, IsString } from "class-validator";

export class ChannelUpdateDto {
    @IsString()
    @IsNotEmpty()
    name?: string;
}