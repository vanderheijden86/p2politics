import { Injectable } from '@angular/core';

// Deprecated, see core/app.config + core/http.config
@Injectable()
export class AppConfig {
    // set the next properties to influence the dev experience - works on localhost only
    private _useStub = false;
    get useStub(): boolean {
        return this._useStub;
    }

    webapiRootUrl = 'http://localhost:3001/v1/';
}
