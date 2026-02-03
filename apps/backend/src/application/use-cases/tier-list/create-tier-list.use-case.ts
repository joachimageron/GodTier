import { Inject, Injectable } from '@nestjs/common';
import { TierList } from '../../../domain/tier-list';
import type { TierListRepository } from '../../ports/tier-list.repository';
import { CreateTierListDto } from '../../dtos/tier-list.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateTierListUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
  ) {}

  async execute(dto: CreateTierListDto, ownerId: number): Promise<TierList> {
    const tierList = new TierList(
      randomUUID(),
      dto.title,
      dto.description,
      ownerId
    );

    await this.tierListRepository.save(tierList);
    return tierList;
  }
}
