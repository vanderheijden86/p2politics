import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { BaseServiceAgent } from '../http/index';
import { BaseMapper, BrowserStorageService, BrowserLocationService } from '../utils/index';

export let HTTP_IMPORTS = [BaseRequestOptions, MockBackend];
export let HTTP_MOCK = {
    provide: Http,
    useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
        return new Http(backend, defaultOptions);
    }, deps: [MockBackend, BaseRequestOptions]
};

export let BASE_SERVICE_REPOSITORY_IMPORTS = [
    BaseMapper, BrowserStorageService, BrowserLocationService
];
export let BASE_SERVICE_AGENT_IMPORTS = [
    BaseServiceAgent,
    HTTP_MOCK,
    HTTP_IMPORTS
];

export const createNumberArray = (length) => {
    return Array.apply(this, {length: length}).map((val, index) => index + 1);
};

export * from './unit-test.helper';
export * from './test-set.model';
