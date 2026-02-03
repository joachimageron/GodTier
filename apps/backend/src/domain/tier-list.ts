export type TierCategory = 'S' | 'A' | 'B' | 'C' | 'D';

export const TIER_CATEGORIES: TierCategory[] = ['S', 'A', 'B', 'C', 'D'];

export const TIER_DESCRIPTIONS: Record<TierCategory, string> = {
  S: "Les chefs-d'œuvre du branding",
  A: "Très bons logos",
  B: "Ça passe",
  C: "Médiocres",
  D: "Les flops visuels"
};

export interface Logo {
  id: string;
  imageUrl: string;
  name: string;
}

export class TierList {
  private readonly _items: Map<TierCategory, Logo[]>;
  public readonly MAX_LOGOS = 10;

  constructor(
    public readonly id: string,
    public title: string,
    public description: string | undefined,
    initialItems: Partial<Record<TierCategory, Logo[]>> = {},
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this._items = new Map();
    this.initializeCategories();
    this.hydrateItems(initialItems);
  }

  private initializeCategories() {
    TIER_CATEGORIES.forEach(category => {
      this._items.set(category, []);
    });
  }

  private hydrateItems(items: Partial<Record<TierCategory, Logo[]>>) {
    let totalCount = 0;
    
    for (const category of TIER_CATEGORIES) {
      if (items[category]) {
        const logos = items[category]!;
        totalCount += logos.length;
        this._items.set(category, [...logos]);
      }
    }

    if (totalCount > this.MAX_LOGOS) {
      throw new Error(`Tier List cannot contain more than ${this.MAX_LOGOS} logos.`);
    }
  }

  public get items(): Record<TierCategory, ReadonlyArray<Logo>> {
    const result: Partial<Record<TierCategory, ReadonlyArray<Logo>>> = {};
    this._items.forEach((logos, category) => {
      result[category] = [...logos];
    });
    return result as Record<TierCategory, ReadonlyArray<Logo>>;
  }

  public get totalLogosCount(): number {
    let count = 0;
    this._items.forEach((logos) => {
      count += logos.length;
    });
    return count;
  }

  public addLogo(logo: Logo, category: TierCategory): void {
    if (this.totalLogosCount >= this.MAX_LOGOS) {
      throw new Error(`Cannot add logo. limit of ${this.MAX_LOGOS} logos reached.`);
    }

    const categoryLogos = this._items.get(category);
    if (!categoryLogos) {
      throw new Error(`Invalid category: ${category}`);
    }

    if (this.findLogoCategory(logo.id)) {
        throw new Error("Logo already exists in the Tier List");
    }

    categoryLogos.push(logo);
    this.touch();
  }

  public moveLogo(logoId: string, toCategory: TierCategory): void {
    const currentCategory = this.findLogoCategory(logoId);
    
    if (!currentCategory) {
      throw new Error("Logo not found in this Tier List.");
    }

    if (currentCategory === toCategory) {
      return;
    }

    const currentLogos = this._items.get(currentCategory)!;
    const logoIndex = currentLogos.findIndex(l => l.id === logoId);
    
    if (logoIndex === -1) {
        throw new Error("Logo not found.");
    }

    const [logo] = currentLogos.splice(logoIndex, 1);
    this._items.get(toCategory)!.push(logo);
    this.touch();
  }

  private findLogoCategory(logoId: string): TierCategory | undefined {
    for (const [category, logos] of this._items.entries()) {
      if (logos.some(l => l.id === logoId)) {
        return category;
      }
    }
    return undefined;
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
