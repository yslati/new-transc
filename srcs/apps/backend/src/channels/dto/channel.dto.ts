import { IsNotEmpty, IsIn, Length } from 'class-validator';

export class CreateChannelDto {
    id?: number;
    @IsNotEmpty()
    @Length(4, 10)
    name: string;

    @IsNotEmpty()
    @IsIn(["public", "private"])
    type: string;

    password?: string;
}