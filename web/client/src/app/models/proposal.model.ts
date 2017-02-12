import { VoteStatistics } from './vote-statistics.model';
import { isPast } from 'date-fns';

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
    iterations: Proposal[];
    voteStatistics: VoteStatistics;
    get isEnded(): boolean {
        return isPast(this.endDate);
    }
}

export class Argument {
    title: string;
    description: string;
}
