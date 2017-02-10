import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent, AppRequestOptions } from '../services/base/http/index';
import { HttpConfig } from '../core/http.config';
// import { Web3Service } from '../services/web3.service';

@Injectable()
export class ContractRpcServiceAgent {
    constructor(
        private baseServiceAgent: BaseServiceAgent,
        private httpConfig: HttpConfig,
        private mdSnackBar: MdSnackBar) { }

    getContractMetaData(contractName: string): Observable<any> {
        return this.baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: `${this.httpConfig.api.contracts}${contractName}.json`
        }));
    }
}
