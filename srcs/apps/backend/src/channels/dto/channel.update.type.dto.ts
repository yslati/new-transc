import { IsIn } from "class-validator";

export class ChannelTypeDto {
    @IsIn(["public", "private"])
    type: string

    password?: string
}