import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TierList } from '../../../domain/tier-list';
import type { TierListRepository } from '../../ports/tier-list.repository';

@Injectable()
export class GetTierListUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
  ) {}

  async execute(id: string): Promise<TierList> {
    const tierList = await this.tierListRepository.findById(id);
    if (!tierList) {
      throw new NotFoundException(`Tier List with ID ${id} not found`);
    }
    return tierList;
  }
}
