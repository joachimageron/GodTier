import { Inject, Injectable } from '@nestjs/common';
import { Logo } from '../../../domain/logo';
import type { LogoRepository } from '../../ports/logo.repository';
import { CreateLogoDto } from '../../dtos/logo.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateLogoUseCase {
    constructor(
        @Inject('LogoRepository')
        private readonly logoRepository: LogoRepository
    ) {}

    async execute(dto: CreateLogoDto): Promise<Logo> {
        const logo = new Logo(
            randomUUID(),
            dto.name,
            dto.imageUrl,
            new Date()
        );
        return this.logoRepository.create(logo);
    }
}
