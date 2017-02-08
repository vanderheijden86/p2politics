import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { MdSnackBar } from '@angular/material';

import { BaseServiceAgent, AppRequestOptions } from '../services/base/http/index';
import { BrowserStorageService } from '../services/base/utils/index';

@Injectable()
export class AppConfig {

    name = 'P2Politics';
    debugMode = document.location.hostname === 'localhost';

    constructor(
        private baseServiceAgent: BaseServiceAgent,
        private browserStorageService: BrowserStorageService,
        private mdSnackBar: MdSnackBar) { }

    configureApp() {

        this.baseServiceAgent.configure({
            onError: (res) => this.onHttpError(res)
        });
        this.setDefaultAuthorizationHeader();

        this.browserStorageService.init({
            storageType: 'localStorage',
            prefix: 'P2P-'
        });
    }

    private setDefaultAuthorizationHeader() {
        AppRequestOptions.defaultHeaders.set('Authorization',
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYmFuY2Fpci1pcG8tem' +
            'liLXZvLWJlZHJpanZlbiIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHlzZXJ2aWNlcy5kY3dmMDEuZGV2LmV4dHJhaG9zd' +
            'GluZy5jb3JwLyIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHlzZXJ2aWNlcy5kY3dmMDEuZGV2LmV4dHJhaG9zdGluZy5j' +
            'b3JwLyIsImV4cCI6MTQ2Nzg0OTYwMCwibmJmIjoxNDYwNTMyOTI3fQ.hRBF-CH9xkQb3vrZo2P1J7xd6EWbb5fkohn7yyZ7emM'
        );
    }

    private onHttpError(response: Response) {
        this.mdSnackBar.open('Er is een fout opgetreden', 'Sluiten', {
            duration: 8000
        });
    }

}
