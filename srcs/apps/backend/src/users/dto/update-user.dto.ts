import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Length, registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

export default class UpdateUserDto {
    @IsNotEmpty()
    @Length(5, 10)
    displayName: string;

    enableTwoFactorAuth: boolean;
}