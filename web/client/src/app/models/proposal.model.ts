export class Proposal {
    proposerAddress: string;
    id: string;
    parentId: string;
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
