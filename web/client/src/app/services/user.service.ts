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

    hasRole(domain: string, role: string): Observable<boolean> {
        return this.contractRpcServiceAgent.getContractInstance('Users')
            .mergeMap(
            contractInstance => {
                // console.log('contract', response);
                const currentUserAddress = this.web3.eth.coinbase;
                const func: any = Observable.bindNodeCallback(contractInstance.hasRole.call);
                console.log('hasRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', role);
                return func(currentUserAddress, domain, role, { from: this.web3.eth.coinbase })
                    .map((response: boolean) => {
                        console.log('Heb ik admin rechten op insurance?', response);
                        return response;
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
                const func: any = Observable.bindNodeCallback(contractInstance.setRole.call);
                console.log('setRole currentUserAddress', currentUserAddress, 'domain', domain, 'role', role, 'hasRole', hasRole);
                //function setRole(address addr, bytes32 domain, bytes32 role, bool state) returns (bytes32){
                return func(currentUserAddress, domain, role, hasRole, { from: this.web3.eth.coinbase })
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
