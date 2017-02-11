export class Proposal {
    proposerAddress: string;
    id: number;
    parentId: number;
    title: string;
    description: string;
    domain: string;
    category: string;
    phase: string;
    topInFavour: Argument[];
    topAgainst: Argument[];
    maxVoteScale: number;
    startDate: Date;
    endDate: Date;
    completed: number;
}

export class Argument {
    title: string;
    description: string;
}
