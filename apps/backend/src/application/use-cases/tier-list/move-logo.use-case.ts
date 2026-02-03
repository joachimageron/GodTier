import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TierList } from '../../../domain/tier-list';
import type { TierListRepository } from '../../ports/tier-list.repository';
import { MoveLogoDto } from '../../dtos/tier-list.dto';

@Injectable()
export class MoveLogoUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
  ) {}

  async execute(tierListId: string, dto: MoveLogoDto): Promise<TierList> {
    const tierList = await this.tierListRepository.findById(tierListId);
    
    if (!tierList) {
      throw new NotFoundException(`Tier List with ID ${tierListId} not found`);
    }

    tierList.moveLogo(dto.logoId, dto.categoryId);

    await this.tierListRepository.save(tierList);
    return tierList;
  }
}
