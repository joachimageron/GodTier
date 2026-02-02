import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { UserRepository } from '../../ports/user.repository';
import type { PasswordService } from '../../ports/password.service';
import { SignUpDto } from '../../dtos/auth.dto';
import { User } from '../../../domain/user';

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject('UserRepository') private readonly userRepository: UserRepository,
        @Inject('PasswordService') private readonly passwordService: PasswordService,
    ) {}

    async execute(dto: SignUpDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await this.passwordService.hash(dto.password);
        
        const newUser = await this.userRepository.create({
            email: dto.email,
            name: dto.name,
            password: hashedPassword,
        });

        newUser.password = null; // Remove password before returning
        return newUser;
    }
}
