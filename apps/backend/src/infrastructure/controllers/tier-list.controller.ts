import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TierList, TierRank } from '@godtier/shared';

@ApiTags('tier-lists')
@Controller('tier-lists')
export class TierListController {
    @Get()
    getTierLists(): TierList[] {
        return [
            {
                id: '1',
                title: 'Best Programming Languages',
                description: 'My subjective list',
                items: [
                    { id: '1', content: 'TypeScript', rank: TierRank.S },
                    { id: '2', content: 'Rust', rank: TierRank.S },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
    }
}
