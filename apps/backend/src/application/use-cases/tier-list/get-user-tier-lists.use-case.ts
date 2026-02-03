import { Inject, Injectable } from '@nestjs/common';
import { TierList } from '../../../domain/tier-list';
import type { TierListRepository } from '../../ports/tier-list.repository';

@Injectable()
export class GetUserTierListsUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
  ) {}

  async execute(ownerId: number): Promise<TierList[]> {
    return this.tierListRepository.findByOwnerId(ownerId);
  }
}
