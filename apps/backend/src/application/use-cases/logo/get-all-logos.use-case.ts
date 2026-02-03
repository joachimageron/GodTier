import { Inject, Injectable } from '@nestjs/common';
import { Logo } from '../../../domain/logo';
import type { LogoRepository } from '../../ports/logo.repository';

@Injectable()
export class GetAllLogosUseCase {
    constructor(
        @Inject('LogoRepository')
        private readonly logoRepository: LogoRepository
    ) {}

    async execute(): Promise<Logo[]> {
        return this.logoRepository.findAll();
    }
}
