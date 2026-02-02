import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string | null;

    @IsString()
    @MinLength(6)
    password: string;
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
