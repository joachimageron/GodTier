import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case';
import { SignUpDto, SignInDto } from '../../application/dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly signInUseCase: SignInUseCase,
    ) {}

    @Post('signup')
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
    async signIn(@Body() dto: SignInDto) {
        return this.signInUseCase.execute(dto);
    }
}
