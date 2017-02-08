import { Headers, RequestMethod } from '@angular/http';

import { AppRequestOptions } from './app-request-options';

describe('AppRequestOptions', () => {

    describe('Headers', () => {

        let jsonType: string;
        let jsonTypeHeaders: string[];
        beforeEach(() => {
            jsonType = 'application/json';
            jsonTypeHeaders = ['accept', 'content-type'];
        });

        it('Should set default JSON headers', () => {
            let cleanAppReq = new AppRequestOptions({});
            for(let header of jsonTypeHeaders) {
                expect(cleanAppReq.headers.get(header)).toBe(jsonType);
            }
        });

        it('Should contain default headers + given headers when headers given', () => {
            let appReqWithHeaders = new AppRequestOptions({
                headers: new Headers({ 'test': 'TestValue' })
            });

            expect(appReqWithHeaders.headers.keys().length).toBe(3);
            expect(appReqWithHeaders.headers.keys()).toEqual(['test'].concat(jsonTypeHeaders));
        });

        it('Should override default header when that header is given', () => {
            let appReqWithOverridenHeaders = new AppRequestOptions({
                headers: new Headers({ 'accept': 'TestValue' })
            });

            expect(appReqWithOverridenHeaders.headers.keys().length).toBe(2);
            expect(appReqWithOverridenHeaders.headers.get('accept')).toBe('TestValue');
        });
    });

    describe('RequestMethod', () => {
        it('Should set GET request method as default', () => {
            let cleanAppReq = new AppRequestOptions({});
            expect(cleanAppReq.method).toBe(RequestMethod.Get);
        });

        it('Should set correct request method on init', () => {
            for(let method in RequestMethod) {
                expect(RequestMethod[new AppRequestOptions({method: RequestMethod[method]}).method]).toBeDefined();
            }
        });
    });
});
