import { IsNotEmpty, IsNumber, Length } from "class-validator";

export class ConversationDto {

    @IsNumber()
    from: number;

    @IsNumber()
    to: number;

    @IsNotEmpty()
    @Length(1, 2000)
    message: string;
}