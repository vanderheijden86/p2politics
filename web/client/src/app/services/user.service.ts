import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';

import { DomainUser } from '../models/domain-user.model';
import { Role } from '../models/role.enum';

@Injectable()
export class UserService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    getDomainUser(domain: string): Observable<DomainUser> {
        const result = new DomainUser();
        return Observable
            .zip(
            this.hasRole(domain, Role.admin),
            this.hasRole(domain, Role.proposer),
            this.hasRole(domain, Role.voter),
            (isAdmin: boolean, isProposer: boolean, isVoter: boolean) => {
                result.isAdmin = isAdmin;
                result.isProposer = isProposer;
                result.isVoter = isVoter;
            })
            .map(() => {
                console.log(`getDomainUser for ${domain}`, result);
                return result;
            });
    }

    hasRole(domain: string, role: Role): Observable<boolean> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.hasRole);
                console.log('hasRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', Role[role]);
                return func(currentUserAddress, domain, Role[role], { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log(`Heb ik ${Role[role]} rechten op ${domain}?`, response);
                        console.log('response.toNumber()', response.toNumber());
                        return response.toNumber() === 1;
                    }, (error) => {
                        console.error('error op hasRole', error);
                    });
            });
    }
    setRole(domain: string, role: Role, hasRole: boolean): Observable<string> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.setRole);
                let hasRoleInt = hasRole ? 1 : 0;
                console.log('setRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', Role[role], 'hasRole', hasRole, 'hasRoleInt', hasRoleInt);
                return func(currentUserAddress, domain, Role[role], hasRoleInt, { from: this.web3.eth.coinbase })
                    .map((response: string) => {
                        let result = this.web3.toAscii(response);
                        console.log('setRole hasRole-input', hasRole, 'response', response, 'result', result);
                        // 'error', error,
                        return result;
                    });
            });
    }


    testje(): Observable<number> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.testje.call);
                return func({ from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('testje response', response, 'toNumber', response.toNumber());
                        // 'error', error,
                        return response.toNumber();
                    }, (error) => {
                        console.error('error op testje', error);
                    });
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
