import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent, AppRequestOptions } from '../services/base/http/index';
import { HttpConfig } from '../core/http.config';
import { Web3Service } from '../services/web3.service';

@Injectable()
export class ContractRpcServiceAgent {
    constructor(
        private baseServiceAgent: BaseServiceAgent,
        private httpConfig: HttpConfig,
        private web3Service: Web3Service,
        private mdSnackBar: MdSnackBar) { }

    getContractInstance(contractName: string): Observable<any> {
        return this.getContractMetaData(contractName)
            .map((response) => {
                let metaData = response;
                let contract = this.web3.eth.contract(metaData.abi);
                let firstNetwork: any = Object.keys(metaData.networks)[0];
                //console.log('contract', contract);
                let contractInstance = contract.at(firstNetwork.address);
                return contractInstance;
            });
    }
    private getContractMetaData(contractName: string): Observable<any> {
        return this.baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: `${this.httpConfig.api.contracts}${contractName}.json`
        }));
    }

    get web3() {
        return this.web3Service.web3;
    }

}
