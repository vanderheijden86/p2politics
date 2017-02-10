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
    test():Observable<boolean> {
        return this.hasRole('insurance', 'admin')
        .map((response) => {
            console.log('Ik heb admin rechten op insurance');
            return response;
        }, (error) => {
            console.error('error op hasRole', error);
        });
    }
    private hasRole(domain: string, role: string): Observable<boolean> {
        return this.contractRpcServiceAgent.getContractInstance('User')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.hasRole.call);
                return func(currentUserAddress, domain, role, { from: currentUserAddress })
                    .map((response: boolean) => {
                        console.log('hasRole response', response);
                        // 'error', error,
                        return response;
                    });
            });
    }
    /*
    function hasRole(address addr, bytes32 domain, bytes32 role) returns (bool) {
        return roles[addr][sha3(domain, role)];
    }
    */
    get web3() {
        return this.web3Service.web3;
    }
}
