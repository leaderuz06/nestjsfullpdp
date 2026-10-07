import { IsEmail, IsNotEmpty, IsNumberString, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    password!: string;

    @Matches(/^\+998\d{9}$/, { message: 'Phone number must be in the format +998XXXXXXXXX' })
    @IsNotEmpty()
    phone!: string;
}
