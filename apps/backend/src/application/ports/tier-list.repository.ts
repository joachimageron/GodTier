import { TierList } from '../../domain/tier-list';

export interface TierListRepository {
    findAll(): Promise<TierList[]>;
    findById(id: string): Promise<TierList | null>;
    create(tierList: TierList): Promise<TierList>;
}
