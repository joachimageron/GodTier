import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogoDto {
    @ApiProperty({ example: 'Google' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'https://logo.dev/google.png' })
    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;
}
