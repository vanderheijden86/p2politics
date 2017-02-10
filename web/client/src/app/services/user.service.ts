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
                let domainHex = this.web3._extend.utils.padRight(this.web3.fromAscii(domain), 32);
                let roleHex = this.web3._extend.utils.padRight(this.web3.fromAscii(role), 32);
                console.log('currentUserAddress', currentUserAddress, 'domain', domain, 'role', role);
                //console.log('currentUserAddress', currentUserAddress, 'domainHex', domainHex, 'roleHex', roleHex);
                return func(currentUserAddress, domain, role, { from: this.web3.eth.coinbase })
                //return func(currentUserAddress, domainHex, roleHex, { from: this.web3.eth.coinbase })
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
