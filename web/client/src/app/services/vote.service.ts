import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getTime } from 'date-fns';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';
import { ConvertDate } from '../utils/convert-date';
import { ConvertString } from '../utils/convert-string';

import { Vote } from '../models/vote.model';

@Injectable()
export class VoteService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    voreForProposal(proposalId: number, value: number, comment: string): Observable<string> {
        let currentUserAddress = this.web3.eth.coinbase;
        console.log('voreForProposal proposalId', proposalId, 'currentUserAddress', currentUserAddress, 'value', value);
        return this.contractRpcServiceAgent.getContractInstance('Votes')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.vote);
                return func(proposalId, value, comment, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('response', response);
                        return response;
                    });
            });
    }

    getProposalVote(proposalId: number): Observable<Vote> {
        let currentUserAddress = this.web3.eth.coinbase;
        console.log('getProposalVote proposalId', proposalId, 'currentUserAddress', currentUserAddress);
        return this.contractRpcServiceAgent.getContractInstance('Votes')
            .mergeMap(contractInstance => {
                return this.getProposalVoteCount(contractInstance, proposalId)
                    .mergeMap(count => {
                        const numberArray = Array.apply(this, { length: count }).map((val, index) => index);
                        console.log('count', count, 'numberArray', numberArray);
                        return Observable.zip<Vote>(...numberArray.map(index => this.getProposalVoteByIndex(contractInstance, proposalId, index)))
                            .map(votes => votes.filter(vote => vote.userId === currentUserAddress)[0]);
                    });
            });
    }

    private getProposalVoteCount(contractInstance: any, proposalId: number): Observable<number> {
        const func: any = Observable.bindNodeCallback(contractInstance.getProposalVoteCount);
        return func(proposalId, { from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('response', response);
                console.log('response.toNumber()', response.toNumber());
                return response.toNumber();
            });
    }

    private getProposalVoteByIndex(contractInstance: any, proposalId: number, index: number): Observable<Vote> {
        console.log('getProposalVoteByIndex proposalId', proposalId, 'index', index);
        const func: any = Observable.bindNodeCallback(contractInstance.getProposalVote);
        return func(proposalId, index, { from: this.web3.eth.coinbase })
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

    // addVote(vote: Vote): Observable<number> {
    //     return this.contractRpcServiceAgent.getContractInstance('Votes')
    //         .mergeMap(contractInstance => {
    //             const func: any = Observable.bindNodeCallback(contractInstance.setVote);
    //             return func(vote.parentId, vote.title, vote.domain, vote.category, vote.phase,
    //                 vote.description, vote.maxVoteScale, ConvertDate.toUnix(vote.endDate), vote.completed, { from: this.web3.eth.coinbase })
    //                 .map((response: any) => {
    //                     console.log('setVote response', response);
    //                     const result = response.toNumber();
    //                     console.log('setVote result', result);
    //                     return result;
    //                 }, (error) => {
    //                     console.error('addVote error', error);
    //                 });
    //         });
    // }

    get web3() {
        return this.web3Service.web3;
    }
}
