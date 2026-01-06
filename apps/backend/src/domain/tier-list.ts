export class TierList {
    constructor(
        public id: string,
        public title: string,
        public description: string | undefined,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}
