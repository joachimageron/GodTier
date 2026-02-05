import { TierList } from '../../domain/tier-list';

export interface PdfGeneratorService {
  generateTierListsSummary(tierLists: TierList[]): Promise<Buffer>;
}
