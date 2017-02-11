import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getTime } from 'date-fns';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';
import { ConvertDate } from '../utils/convert-date';

import { Proposal } from '../models/proposal.model';

@Injectable()
export class ProposalService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    getProposals(domain: string): Observable<[Proposal]> {
        return this.contractRpcServiceAgent.getContractInstance('Proposals')
            .mergeMap(contractInstance => {
                return this.getProposalCount(contractInstance)
                    .mergeMap(count => {
                        const numberArray = Array.apply(this, { length: count }).map((val, index) => index);
                        console.log('count', count, 'numberArray', numberArray);
                        return Observable.zip<Proposal>(...numberArray.map(index => this.getProposalByIndex(contractInstance, index)))
                            .map(proposals => proposals.filter(proposal => proposal.domain === domain));
                    });
            });
    }

    private getProposalCount(contractInstance: any): Observable<number> {
        const func: any = Observable.bindNodeCallback(contractInstance.getCount);
        return func({ from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('response', response);
                console.log('response.toNumber()', response.toNumber());
                return response.toNumber();
            }, (error) => {
                console.error('error op hasRole', error);
            });
    }

    private getProposalByIndex(contractInstance: any, index: number): Observable<Proposal> {
        console.log('getProposalByIndex index', index);
        const func: any = Observable.bindNodeCallback(contractInstance.getProposal);
        return func(index, { from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('getProposalByIndex response', response);
                const result = this.mapResponseToProposal(response);
                console.log('getProposalByIndex result', result);
                return result;
            }, (error) => {
                console.error('getProposalByIndex error', error);
            });
    }

    private mapResponseToProposal(response: any): Proposal {
        const result = new Proposal();
        result.parentId = response[0].toNumber();
        result.title = this.web3.toAscii(response[1]);
        result.domain = this.web3.toAscii(response[2]);
        result.category = this.web3.toAscii(response[3]);
        result.phase = this.web3.toAscii(response[4]);
        result.description = response[5];
        result.maxVoteScale = response[6].toNumber();
        result.startDate = ConvertDate.fromUnix(response[7].toNumber());
        result.endDate = ConvertDate.fromUnix(response[8].toNumber());
        result.completed = response[9].toNumber();
        return result;
    }

    addProposal(proposal: Proposal): Observable<number> {
        return this.contractRpcServiceAgent.getContractInstance('Proposals')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.setProposal);
                return func(proposal.parentId, proposal.title, proposal.domain, proposal.category, proposal.phase,
                    proposal.description, proposal.maxVoteScale, ConvertDate.toUnix(proposal.endDate), proposal.completed, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('setProposal response', response);
                        const result = response.toNumber();
                        console.log('setProposal result', result);
                        return result;
                    }, (error) => {
                        console.error('addProposal error', error);
                    });
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
