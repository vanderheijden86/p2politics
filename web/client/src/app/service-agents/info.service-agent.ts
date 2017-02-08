import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent, AppRequestOptions } from '../services/base/http/index';
import { HttpConfig } from '../core/http.config';
import { Balance } from '../models/webapi/balance.model';

@Injectable()
export class InfoServiceAgent {
    constructor(
        private baseServiceAgent: BaseServiceAgent,
        private httpConfig: HttpConfig,
        private mdSnackBar: MdSnackBar) { }

    getBalance(): Observable<Balance> {
        if (this.httpConfig.useStub) {
            this.mdSnackBar.open('LET OP: call naar backend is uitgeschakeld!', 'Sluiten', {
                duration: 8000
            });
            let result = new Balance({
                coinbase: 'coinbase stub',
                originalBalance: 42
            });
            result.coinbase = 'coinbase stub';
            result.originalBalance = 42;
            return Observable
                .of(result)
                .delay(1000);
        }

        return this.baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: `${this.httpConfig.api.ethereum}web3/balance`
        })).map((response: any) => new Balance(response));
    }
}
