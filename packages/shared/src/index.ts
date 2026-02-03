export type TierCategory = 'S' | 'A' | 'B' | 'C' | 'D';

export const TIER_CATEGORIES: TierCategory[] = ['S', 'A', 'B', 'C', 'D'];

export const TIER_DESCRIPTIONS: Record<TierCategory, string> = {
  S: "Les chefs-d'œuvre du branding",
  A: "Très bons logos",
  B: "Ça passe",
  C: "Médiocres",
  D: "Les flops visuels"
};

export interface TierList {
    id: string;
    title: string;
    description?: string;
    items: Record<TierCategory, Logo[]>;
    createdAt: Date;
    updatedAt: Date;
    ownerId?: number;
}

export interface Logo {
    id: string;
    name: string;
    imageUrl: string;
}
