import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent } from './base.service-agent';
import { AppConfig } from '../app.config';
import { Balance } from '../models/webapi/balance.model';

@Injectable()
export class InfoServiceAgent extends BaseServiceAgent {
    constructor(
        http: Http,
        snackBar: MdSnackBar,
        appConfig: AppConfig) {
        super(http, snackBar, appConfig);
    }

    getBalance(): Observable<Balance> {
        if (this.appConfig.useStub) {
            this.snackBar.open('LET OP: call naar backend is uitgeschakeld!', 'Sluiten', {
                duration: 8000
            });
            let result = new Balance();
            result.coinbase = 'coinbase stub'; 
            result.originalBalance = 42;
            return Observable
                .of(result)
                .delay(1000);
        } else {
            let url = 'web3/balance';
            return super.get(null, url)
                .map((response: any) => {
                    return new Balance(response);
                });
        }
    }
}
