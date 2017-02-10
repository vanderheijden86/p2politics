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
                let metaCoinMetaData = response;
                let metaCoinContract = this.web3.eth.contract(metaCoinMetaData.abi);
                let contractInstance = metaCoinContract.at(metaCoinMetaData.networks['1'].address);
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
