import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getTime } from 'date-fns';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';
import { ConvertDate } from '../utils/convert-date';
import { ConvertString } from '../utils/convert-string';

import { Proposal } from '../models/proposal.model';
import { Vote } from '../models/vote.model';
import { VoteStatistics } from '../models/vote-statistics.model';

@Injectable()
export class VoteService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    voteForProposal(proposal: Proposal, value: number, comment: string): Observable<string> {
        let currentUserAddress = this.web3.eth.coinbase;
        console.log('voreForProposal proposalId', proposal.id, 'iteration', proposal.iteration, 'currentUserAddress', currentUserAddress, 'value', value);
        return this.contractRpcServiceAgent.getContractInstance('Votes')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.vote);
                return func(proposal.id, proposal.iteration, value, comment, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('response', response);
                        return response;
                    });
            });
    }

    getProposalVote(proposal: Proposal): Observable<Vote> {
        let currentUserAddress = this.web3.eth.coinbase;
        console.log('getProposalVote proposalId', proposal.id, 'iteration', proposal.iteration, 'currentUserAddress', currentUserAddress);
        return this.contractRpcServiceAgent.getContractInstance('Votes')
            .mergeMap(contractInstance => {
                return this.getProposalVoteCount(contractInstance, proposal)
                    .mergeMap(count => {
                        const numberArray = Array.apply(this, { length: count }).map((val, index) => index);
                        console.log('count', count, 'numberArray', numberArray);
                        return Observable.zip<Vote>(...numberArray.map(index => this.getProposalVoteByIndex(contractInstance, proposal, index)))
                            .map(votes => votes.filter(vote => vote.userId === currentUserAddress)[0]);
                    });
            });
    }

    private getProposalVoteCount(contractInstance: any, proposal: Proposal): Observable<number> {
        const func: any = Observable.bindNodeCallback(contractInstance.getProposalVoteCount);
        return func(proposal.id, proposal.iteration, { from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('response', response);
                console.log('response.toNumber()', response.toNumber());
                return response.toNumber();
            });
    }

    private getProposalVoteByIndex(contractInstance: any, proposal: Proposal, index: number): Observable<Vote> {
        console.log('getProposalVoteByIndex proposalId', proposal.id, 'iteration', proposal.iteration, 'index', index);
        const func: any = Observable.bindNodeCallback(contractInstance.getProposalVote);
        return func(proposal.id, proposal.iteration, index, { from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('getVoteByIndex response', response);
                const result = this.mapResponseToVote(response);
                console.log('getVoteByIndex result', result);
                return result;
            });
    }

    private mapResponseToVote(response: any): Vote {
        const result = new Vote();
        result.userId = response[0];
        result.proposalId = response[1].toNumber();
        result.value = response[2].toNumber();
        result.revoked = response[3] === 1;
        result.comment = response[4];
        result.timestamp = ConvertDate.fromUnix(response[5].toNumber());
        return result;
    }

    getAcceptedAndRejectedVotes(proposal: Proposal): Observable<VoteStatistics> {
        return this.contractRpcServiceAgent.getContractInstance('Votes')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.getAcceptedAndRejectedVotes);
                return func(proposal.id, proposal.iteration, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('getAcceptedAndRejectedVotes response', response);
                        const result = new VoteStatistics();
                        result.acceptedVotes = response[0].toNumber();
                        result.rejectedVotes = response[1].toNumber();
                        return result;
                    });
            });

    }

    get web3() {
        return this.web3Service.web3;
    }
}
