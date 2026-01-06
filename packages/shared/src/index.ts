export interface TierList {
    id: string;
    title: string;
    description?: string;
    items: TierItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TierItem {
    id: string;
    content: string;
    imageUrl?: string;
    rank: TierRank;
}

export const TierRank = {
    S: 'S',
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    F: 'F'
} as const;

export type TierRank = typeof TierRank[keyof typeof TierRank];
