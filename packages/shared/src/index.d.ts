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
export declare const TierRank: {
    readonly S: "S";
    readonly A: "A";
    readonly B: "B";
    readonly C: "C";
    readonly D: "D";
    readonly F: "F";
};
export type TierRank = typeof TierRank[keyof typeof TierRank];
