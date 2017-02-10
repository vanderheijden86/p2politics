import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ContractRpcServiceAgent } from '../service-agents';
import { Web3Service } from '../services/web3.service';

@Injectable()
export class UserService {
    constructor(
        private contractRpcServiceAgent: ContractRpcServiceAgent,
        private web3Service: Web3Service) { }

    //getUser(user);
    getHasRole(): Observable<boolean> {
        return this.hasRole('insurance', 'admin')
            .map((response) => {
                console.log('Heb ik admin rechten op insurance?', response);
                return response;
            }, (error) => {
                console.error('error op hasRole', error);
            });
    }

    private hasRole(domain: string, role: string): Observable<boolean> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.hasRole.call);
                let domainHex = this.web3.fromAscii(domain, 64);
                let roleHex = this.web3.fromAscii(role, 64);
                return func(currentUserAddress, domainHex, roleHex, { from: this.web3.eth.coinbase })
                    .map((response: boolean) => {
                        console.log('hasRole response', response);
                        // 'error', error,
                        return response;
                    });
            });
    }

    testje(): Observable<number> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                const func: any = Observable.bindNodeCallback(contractInstance.testje.call);
                return func({ from: this.web3.eth.coinbase })
                    .map((response: number) => {
                        console.log('testje response', response);
                        // 'error', error,
                        return response;
                    }, (error) => {
                        console.error('error op testje', error);
                    });
            });
    }

    get web3() {
        return this.web3Service.web3;
    }
}
