import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TierList } from '../../../domain/tier-list';
import type { TierListRepository } from '../../ports/tier-list.repository';
import { AddLogoDto } from '../../dtos/tier-list.dto';

@Injectable()
export class AddLogoUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
  ) {}

  async execute(tierListId: string, dto: AddLogoDto): Promise<TierList> {
    const tierList = await this.tierListRepository.findById(tierListId);
    
    if (!tierList) {
      throw new NotFoundException(`Tier List with ID ${tierListId} not found`);
    }

    tierList.addLogo({
      id: dto.id,
      name: dto.name,
      imageUrl: dto.imageUrl
    }, dto.category);

    await this.tierListRepository.save(tierList);
    return tierList;
  }
}
