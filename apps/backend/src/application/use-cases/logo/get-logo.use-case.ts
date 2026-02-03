import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logo } from '../../../domain/logo';
import type { LogoRepository } from '../../ports/logo.repository';

@Injectable()
export class GetLogoUseCase {
    constructor(
        @Inject('LogoRepository')
        private readonly logoRepository: LogoRepository
    ) {}

    async execute(id: string): Promise<Logo> {
        const logo = await this.logoRepository.findById(id);
        if (!logo) {
            throw new NotFoundException(`Logo with ID ${id} not found`);
        }
        return logo;
    }
}
