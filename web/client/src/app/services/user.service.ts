import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';

import { DomainUser } from '../models/domain-user.model';

@Injectable()
export class UserService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    //getUser(user);
    getDomainUser(domain: string): Observable<DomainUser> {
        const result = new DomainUser();
        // let isAdminSubscription = this.hasRole(domain, 'admin');
        // let isProposerSubscription = this.hasRole(domain, 'proposer');
        // let isVoterSubscription = this.hasRole(domain, 'voter');
        return Observable
            .zip(
            this.hasRole(domain, 'admin'),
            this.hasRole(domain, 'proposer'),
            this.hasRole(domain, 'voter'),
            (isAdmin: boolean, isProposer: boolean, isVoter: boolean) => {
                result.isAdmin = isAdmin;
                result.isProposer = isProposer;
                result.isVoter = isVoter;
            })
            .map(()=> {
                console.log(`getDomainUser for ${domain}`, result);
                return result;
            });

        // return new Observable()
        //     .mergeMap(
        //     this.hasRole(domain, 'admin').subscribe((response) => result.isAdmin = response),
        //     this.hasRole(domain, 'proposer'),
        //     this.hasRole(domain, 'voter')
        //     );
    }
    hasRole(domain: string, role: string): Observable<boolean> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.hasRole);
                console.log('hasRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', role);
                return func(currentUserAddress, domain, role, { from: this.web3.eth.coinbase })
                    .map((response: any) => {
                        console.log('Heb ik admin rechten op insurance?', response);
                        console.log('response.toNumber()', response[0].toNumber(), 'address', response[1]);
                        return response[0].toNumber() === 1;
                    }, (error) => {
                        console.error('error op hasRole', error);
                    });
            });
    }
    setRole(domain: string, role: string, hasRole: boolean): Observable<string> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.setRole);
                let hasRoleInt = hasRole ? 1 : 0;
                console.log('setRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', role, 'hasRole', hasRole, 'hasRoleInt', hasRoleInt);
                //function setRole(address addr, bytes32 domain, bytes32 role, bool state) returns (bytes32){
                return func(currentUserAddress, domain, role, hasRoleInt, { from: this.web3.eth.coinbase })
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
