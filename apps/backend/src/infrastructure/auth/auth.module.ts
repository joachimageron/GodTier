import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from '../controllers/auth.controller';
import { BcryptService } from './bcrypt.service';
import { JwtTokenService } from './jwt-token.service';
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case';
import { UserRepository } from '../database/repositories/user.repository';

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey', // In production use env vars
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        SignUpUseCase,
        SignInUseCase,
        {
            provide: 'UserRepository',
            useExisting: UserRepository,
        },
        {
            provide: 'PasswordService',
            useClass: BcryptService,
        },
        {
            provide: 'TokenService',
            useClass: JwtTokenService,
        },
    ],
})
export class AuthModule {}
