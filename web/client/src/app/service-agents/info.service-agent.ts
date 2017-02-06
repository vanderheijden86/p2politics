import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent } from './base.service-agent';
import { AppConfig } from '../app.config';
import { InfoViewModel } from '../models';

@Injectable()
export class InfoServiceAgent extends BaseServiceAgent {
    constructor(
        http: Http,
        snackBar: MdSnackBar,
        appConfig: AppConfig) {
        super(http, snackBar, appConfig);
    }

    getInfos(): Observable<InfoViewModel[]> {
        if (this.appConfig.useStub) {
            this.snackBar.open('LET OP: call naar backend is uitgeschakeld!', 'Sluiten', {
                duration: 8000
            });
            let result = new Array<InfoViewModel>();
            const info1 = new InfoViewModel();
            info1.test = 'Hopla';
            const info2 = new InfoViewModel();
            info2.test = 'kee';
            result.push(info1);
            result.push(info2); 
            return Observable
                .of(result)
                .delay(1000);
        } else {
            let url = 'get_users_claims';
            return super.get(null, url)
                .map((response: any) => {
                    // console.log(result)
                    let result = new Array<InfoViewModel>();
                    // if (response) {
                    // for (let element of response.claims) {
                    //     let claim = new ClaimViewModel(this.appConfig.webapiRootUrl, element);
                    //     result.push(claim);
                    // }
                    // }
                    return result;
                });
        }
    }

}
