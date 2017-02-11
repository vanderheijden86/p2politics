import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { getTime } from 'date-fns';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';
import { ConvertDate } from '../utils/convert-date';
import { ConvertString } from '../utils/convert-string';

import { Proposal } from '../models/proposal.model';

@Injectable()
export class ProposalService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    activeProposal: Proposal;

    getProposals(domain: string): Observable<[Proposal]> {
        return this.contractRpcServiceAgent.getContractInstance('Proposals')
            .mergeMap(contractInstance => {
                console.log('getProposals domain=', domain);
                return this.getProposalCount(contractInstance)
                    .mergeMap(count => {
                        const numberArray = Array.apply(this, { length: count }).map((val, index) => index);
                        console.log('domain', domain, 'count', count, 'numberArray', numberArray);
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
            });
    }

    private getProposalByIndex(contractInstance: any, index: number): Observable<Proposal> {
        console.log('getProposalByIndex index', index);
        const func: any = Observable.bindNodeCallback(contractInstance.getProposal);
        return func(index, { from: this.web3.eth.coinbase })
            .map((response: any) => {
                console.log('getProposalByIndex response', response);
                const result = this.mapResponseToProposal(index, response);
                console.log('getProposalByIndex result', result);
                return result;
            });
    }

    private mapResponseToProposal(index: number, response: any): Proposal {
        const result = new Proposal();
        result.id = response[0].toNumber();
        result.iteration = response[1].toNumber();
        result.title = ConvertString.asciiToString(this.web3.toAscii(response[2]));
        result.domain = ConvertString.asciiToString(this.web3.toAscii(response[3]));
        result.category = ConvertString.asciiToString(this.web3.toAscii(response[4]));
        result.phase = ConvertString.asciiToString(this.web3.toAscii(response[5]));
        result.description = response[6];
        result.startDate = ConvertDate.fromUnix(response[7].toNumber());
        result.endDate = ConvertDate.fromUnix(response[8].toNumber());
        result.completed = response[9].toNumber();
        return result;
    }

    addNewProposal(proposal: Proposal): Observable<number> {
        return this.contractRpcServiceAgent.getContractInstance('Proposals')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.newProposal);
                return func(proposal.title, proposal.domain, proposal.category, proposal.phase,
                    proposal.description, ConvertDate.toUnix(proposal.endDate), proposal.completed, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('setProposal response', response);
                        const result = response.toNumber();
                        console.log('setProposal result', result);
                        return result;
                    });
            });
    }

    addNewIteration(proposal: Proposal): Observable<number> {
        return this.contractRpcServiceAgent.getContractInstance('Proposals')
            .mergeMap(contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.newIteration);
                return func(proposal.id, proposal.title, proposal.domain, proposal.category, proposal.phase,
                    proposal.description, ConvertDate.toUnix(proposal.endDate), proposal.completed, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('setProposal response', response);
                        const result = response.toNumber();
                        console.log('setProposal result', result);
                        return result;
                    });
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
