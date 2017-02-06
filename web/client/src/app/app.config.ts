import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
    // set the next properties to influence the dev experience - works on localhost only
    private _useStub = true;
    get useStub(): boolean {
        return this._useStub;
    }

    webapiRootUrl = 'https://image-recognition.lab.esnad.nl/';
}
