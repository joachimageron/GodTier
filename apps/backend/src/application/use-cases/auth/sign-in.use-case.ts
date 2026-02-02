import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepository } from '../../ports/user.repository';
import type { PasswordService } from '../../ports/password.service';
import type { TokenService } from '../../ports/token.service';
import { SignInDto } from '../../dtos/auth.dto';

@Injectable()
export class SignInUseCase {
    constructor(
        @Inject('UserRepository') private readonly userRepository: UserRepository,
        @Inject('PasswordService') private readonly passwordService: PasswordService,
        @Inject('TokenService') private readonly tokenService: TokenService,
    ) {}

    async execute(dto: SignInDto): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.tokenService.generateToken(payload);

        return { accessToken };
    }
}
