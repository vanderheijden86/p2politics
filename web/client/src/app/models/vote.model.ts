export class Vote {
    userId: string;
    proposalId: string;
    value: number;
    revoked: boolean;
    comment: string;
    timestamp: Date;
}
