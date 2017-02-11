import { VoteStatistics } from './vote-statistics.model';

export class Proposal {
    proposerAddress: string;
    id: number;
    iteration: number;
    title: string;
    description: string;
    domain: string;
    category: string;
    phase: string;
    topInFavour: Argument[];
    topAgainst: Argument[];
    startDate: Date;
    endDate: Date;
    completed: number;
    // view properties
    voteStatistics: VoteStatistics;
}

export class Argument {
    title: string;
    description: string;
}
