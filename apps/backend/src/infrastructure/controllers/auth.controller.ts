import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case';
import { SignUpDto, SignInDto } from '../../application/dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly signInUseCase: SignInUseCase,
    ) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 409, description: 'User already exists.' })
    async signUp(@Body() dto: SignUpDto) {
        const user = await this.signUpUseCase.execute(dto);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async signIn(@Body() dto: SignInDto) {
        return this.signInUseCase.execute(dto);
    }
}
