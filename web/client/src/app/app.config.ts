import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications/components';

@Injectable()
export class AppConfig {
    constructor(
        private notificationsService: NotificationsService) {
    }

    // set the next properties to influence the dev experience - works on localhost only
    private _useStub = false;
    get useStub(): boolean {
        return this._useStub;
    }

    webapiRootUrl = 'https://image-recognition.lab.esnad.nl/';
}
