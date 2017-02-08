import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { HTTP_MOCK, MockHelper } from '../unit-test/index';

import { BaseServiceAgent } from './base.service-agent';
import { AppRequestOptions } from './app-request-options';

describe('BaseServiceAgent', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [MockBackend, BaseRequestOptions, HTTP_MOCK, BaseServiceAgent]
    }));
    let baseServiceAgent: BaseServiceAgent;
    beforeEach(inject([MockBackend, BaseServiceAgent], (mockBackend: MockBackend, _baseServiceAgent: BaseServiceAgent) => {
        baseServiceAgent = _baseServiceAgent;

        const testResp = MockHelper.getDefaultResponse(undefined, 'test response');
        mockBackend.connections.subscribe((c: MockConnection) => {
            setTimeout(() => {
                c.mockRespond(testResp);
            });
        });
    }));

    it('Should initialize correctly', () => {
        expect(baseServiceAgent).toBeDefined();
    });

    it('Should do default http call', async(() => {
        let obs = baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: 'test'
        })).share();
        obs.subscribe(res => {
            expect(res).toBe('test response');
        });
    }));

    it('Should be seperate httpcalls', async(() => {
        let obs1 = baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: 'test1'
        }));
        let obs2 = baseServiceAgent.doHttpCall(new AppRequestOptions({
            url: 'test2'
        }));

        expect(obs1).not.toBe(obs2);
    }));

    it('Should be the same httpcall', async(() => {
        let req = new AppRequestOptions({
            url: 'test'
        });
        let obs1 = baseServiceAgent.doHttpCall(req);
        let obs2 = baseServiceAgent.doHttpCall(req);

        expect(obs1).toBe(obs2);
    }));

    it('Should not be the same httpcall with caching on', async(() => {
        let req = new AppRequestOptions({
            url: 'test',
            cache: false
        });
        let obs1 = baseServiceAgent.doHttpCall(req);
        let obs2 = baseServiceAgent.doHttpCall(req);

        expect(obs1).not.toBe(obs2);
    }));

    it('Should remove cached http observable', async(() => {
        let req = new AppRequestOptions({
            url: 'test'
        });

        let cache = baseServiceAgent.callCache;
        expect(objectLength(cache)).toBe(0);

        baseServiceAgent.doHttpCall(req).subscribe((n => {
            setTimeout(() => {
                expect(objectLength(cache)).toBe(0);

                baseServiceAgent.doHttpCall(req);
                expect(objectLength(cache)).toBe(1);
            });
        }));
        expect(objectLength(cache)).toBe(1);
    }));

    ///// Test functions //////

    function objectLength(obj) {
        let length = 0;
        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
    }
});
