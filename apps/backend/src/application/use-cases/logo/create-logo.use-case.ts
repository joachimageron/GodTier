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

    async execute(dtos: CreateLogoDto[]): Promise<Logo[]> {
        const logos = dtos.map(dto => new Logo(
            randomUUID(),
            dto.name,
            dto.imageUrl,
            new Date()
        ));
        await Promise.all(logos.map(logo => this.logoRepository.create(logo)));
        
        return logos;
    }
}
